package repository

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/fauna/fauna-go"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	verification "github.com/shaw342/projet_argile/backend/Verification"
	"github.com/shaw342/projet_argile/backend/model"
)

func NewFaunaClient() *fauna.Client {
	client, err := fauna.NewDefaultClient()
	if err != nil {
		panic(err)
	}
	return client
}

var ecdsaPrivateKey *ecdsa.PrivateKey

func Register(ctx *gin.Context) {
	client := NewFaunaClient()

	user := model.User{}

	if err := ctx.BindJSON(&user); err != nil {
		log.Fatal(err)
	}

	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		log.Fatal("all field is not completed")
	}

	user.UserId = uuid.New().String()

	user.AccessLevel = "User"

	user.Status = "inactive"

	createUser, err := fauna.FQL(`Signup(${value})`, map[string]any{"value": user})
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err})
		return
	}

	res, err := client.Query(createUser)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err})
		return
	}
	var result model.User

	if err := res.Unmarshal(&result); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(201, result)
}

func EmailVerfication(ctx *gin.Context) {
	email := model.User{}
	client := NewFaunaClient()

	if err := ctx.ShouldBindJSON(&email); err != nil {
		log.Fatal(err)
	}

	result, err := verification.SendMail(email.Email)
	if err != nil {
		log.Fatal(err)
	}

	data := map[string]any{
		"Email": email.Email,
		"Code":  result,
	}

	query, err := fauna.FQL("CodeForMail.create(${data})", map[string]any{"data": data})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, res.Data)
}

func CodeVerification(ctx *gin.Context) {
	client := NewFaunaClient()
	codeEmail := model.CodeEmail{}
	var user model.User

	if err := ctx.ShouldBindJSON(&codeEmail); err != nil {
		ctx.JSON(404, gin.H{"error": "error to bind json"})
		return
	}

	query, err := fauna.FQL(`CodeForMail.byEmail(${email}).first()`, map[string]any{"email": codeEmail.Email})
	if err != nil {
		ctx.JSON(400, gin.H{"error": "error syntax"})
		return
	}

	res, err := client.Query(query)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "error run query"})
		return
	}

	var result model.CodeEmail

	if err := res.Unmarshal(&result); err != nil {
		ctx.JSON(400, gin.H{"error": "error to Unmarshal"})
		return
	}

	if result.Code != codeEmail.Code {
		ctx.JSON(404, gin.H{"error": "the code is incorrect"})
	}

	delete := fmt.Sprintf(`CodeForMail.byEmail("%s").first()!.delete()`, result.Email)

	deleteQuery, err := fauna.FQL(delete, nil)
	if err != nil {
		ctx.JSON(400, gin.H{"erorro": "error for query delete mail"})
	}

	deleteDocument, err := client.Query(deleteQuery)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Print(deleteDocument)

	user.Status = "active"

	updateStatus, err := fauna.FQL(`UpdateUserStatus(${email},${status})`, map[string]any{"email": result.Email, "status": user.Status})
	if err != nil {
		log.Fatal(err)
	}

	update, err := client.Query(updateStatus)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Print(update)
	ctx.JSON(201, gin.H{"success": "the code is correct"})
}

func CreateTask(ctx *gin.Context) {
	client := NewFaunaClient()
	task := model.Task{}

	if err := ctx.ShouldBindJSON(&task); err != nil {
		log.Fatal(err)
	}

	task.TaskId = uuid.NewString()

	createTask, err := fauna.FQL(`Task.create(${task})`, map[string]any{"task": task})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(createTask)
	if err != nil {
		log.Fatal(err)
	}

	var scout model.Task

	if err := res.Unmarshal(&scout); err != nil {
		panic(err)
	}

	ctx.JSON(200, scout)
}

func CreateProject(ctx *gin.Context) {
	userId := ctx.MustGet("UserId")
	client := NewFaunaClient()
	project := model.Project{}

	if err := ctx.ShouldBindJSON(&project); err != nil {
		log.Fatal("error")
	}
	fmt.Println(project)

	project.ProjectId = uuid.New().String()

	createProject, err := fauna.FQL(`CreateProject(${project},${userId})`, map[string]any{"project": project, "userId": userId})
	if err != nil {
		log.Fatal(err)
	}

	resProject, err := client.Query(createProject)
	if err != nil {
		log.Fatal("failed run query")
	}

	var scout model.Project

	if err := resProject.Unmarshal(&scout); err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal("failed sign with project information")
	}

	ctx.JSON(201, scout)
}

func GetId(name string, client *fauna.Client) string {
	var Id string
	query, err := fauna.FQL("User.byName(${name}).map(.id).first()", map[string]any{"name": name})
	if err != nil {
		panic(err)
	}
	res, _ := client.Query(query)

	if err := res.Unmarshal(&Id); err != nil {
		panic(err)
	}

	return Id
}

func DeleteProject(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	name := model.Project{}

	if err := ctx.ShouldBindJSON(&name); err != nil {
		panic(err)
	}
	delete := fmt.Sprintf(`Projects.byName(%s).first()!.delete()`, name.Name)
	query, _ := fauna.FQL(delete, nil)

	res, _ := client.Query(query)

	ctx.JSON(200, res)
}

func DeleteTask(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	data := model.Task{}

	if err := ctx.ShouldBindJSON(&data); err != nil {
		panic(err)
	}

	query, _ := fauna.FQL(`Task.byName(${name}).first()!.delete()`, map[string]any{"name": data.Name})
	res, _ := client.Query(query)
	ctx.JSON(200, res)
}

func Welcome(ctx *gin.Context) {
	userId := ctx.MustGet("UserId")
	token := ctx.MustGet("token").(string)

	client := fauna.NewClient(token, fauna.DefaultTimeouts())

	query, err := fauna.FQL("User.byId(${userId})", map[string]any{"userId": userId})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var user model.User

	if err := res.Unmarshal(&user); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, user)
}

func UpdateProject(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	project := model.Project{}

	if err := ctx.ShouldBindJSON(&project); err != nil {
		panic(err)
	}

	fmt.Print(project)

	query, _ := fauna.FQL(`Projects.byProjectId(${Id}).first()!.update(${project})`, map[string]any{"Id": project.ProjectId, "project": project})

	res, err := client.Query(query)
	if err != nil {
		panic(err)
	}

	var newProject model.Project
	if err := res.Unmarshal(&newProject); err != nil {
		panic(err)
	}

	ctx.JSON(200, newProject.Name)
}

func UpdateTasks(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	task := model.Task{}

	if err := ctx.ShouldBindJSON(&task); err != nil {
		log.Fatal(err)
	}

	query, _ := fauna.FQL(`Task.byName(${name}).first()!.update(${task})`, map[string]any{"Id": task.TaskId, "task": task})

	res, err := client.Query(query)
	if err != nil {
		panic(err)
	}

	var result model.Project

	if err := res.Unmarshal(&result); err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusOK, result)
}

func GetUser(ctx *gin.Context) {
	userId := ctx.MustGet("UserId")
	client := NewFaunaClient()

	getUserString := fmt.Sprintf(`User.byUserId("%s").first()`, userId)

	query, err := fauna.FQL(getUserString, nil)
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(res.Data)

	var scout model.User

	if err := res.Unmarshal(&scout); err != nil {
		ctx.JSON(404, err)
	}
	ctx.JSON(200, scout)
}

func GetTask(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	name := model.Task{}

	if err := ctx.ShouldBindJSON(&name); err != nil {
		ctx.JSON(404, err)
	}

	query, err := fauna.FQL("Task.byName(${name}).first()", map[string]any{"name": name.Name})
	if err != nil {
		panic(err)
	}
	res, err := client.Query(query)
	if err != nil {
		panic(err)
	}
	var task model.Task

	if err := res.Unmarshal(&task); err != nil {
		ctx.JSON(403, err)
	}
	ctx.JSON(200, task)
}

func GetAllProjects(ctx *gin.Context) {
	UserId := ctx.MustGet("UserId")
	client := NewFaunaClient()

	query, err := fauna.FQL("GetAllProject(${userId})", map[string]any{"userId": UserId})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var AllProjects []model.Project

	if err := res.Unmarshal(&AllProjects); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(200, AllProjects)
}

func GetProject(ctx *gin.Context) {
	client := NewFaunaClient()
	id := ctx.Param("id")
	query, err := fauna.FQL(`Projects.byProjectId(${id}).first()`, map[string]any{"id": id})
	if err != nil {
		log.Fatal(err)
	}
	res, err := client.Query(query)
	if err != nil {
		panic(err)
	}

	var result model.Project

	if err := res.Unmarshal(&result); err != nil {
		log.Fatal(err)
	}

	fmt.Print(result)

	ctx.JSON(200, result)
}

func GetUserByEmail(ctx *gin.Context) {
	client := NewFaunaClient()
	auth := model.Auth{}

	if err := ctx.ShouldBindJSON(&auth); err != nil {
		panic(err)
	}
	query, err := fauna.FQL("User.byEmail(${email}).first()", map[string]any{"email": auth.Email})
	if err != nil {
		panic(err)
	}
	res, _ := client.Query(query)

	var user model.User

	if err := res.Unmarshal(&user); err != nil {
		panic(err)
	}

	ctx.JSON(200, user)
}

func init() {
	keyData, err := os.ReadFile("ecdsa_private_key.pem")
	if err != nil {
		panic(err)
	}

	block, _ := pem.Decode(keyData)
	if block == nil || block.Type != "EC PRIVATE KEY" {
		panic("invalid private key ECDSA ")
	}

	ecdsaPrivateKey, err = x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		panic(err)
	}
}

func LoginUser(ctx *gin.Context) {
	client := NewFaunaClient()
	err := godotenv.Load()
	if err != nil {
		panic("probleme with key")
	}

	user := model.User{}

	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Fatalf("fail to bind Json object")
	}

	userData, err := fauna.FQL("User.byEmail(${email}).map(.userId).first()", map[string]any{"email": user.Email})
	if err != nil {
		log.Fatal(err)
	}

	resUser, err := client.Query(userData)
	if err != nil {
		log.Fatal("error to run query")
	}

	var Id string

	if err := resUser.Unmarshal(&Id); err != nil {
		log.Fatal("error to Unmshal use data")
	}

	login, err := fauna.FQL(`LoginUser(${email},${password})`, map[string]any{"email": user.Email, "password": user.Password})
	if err != nil {
		log.Fatalf("error fql syntaxe for login")
	}

	res, err := client.Query(login)
	if err != nil {
		log.Fatalf("error run query")
	}
	var faunaToken model.Tokens

	if err := res.Unmarshal(&faunaToken); err != nil {
		log.Fatalf("failed to Unmarshal data")
	}

	fmt.Println(faunaToken)

	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
		"Issuer": Id,
		"token":  faunaToken.Secret,
		"exp":    time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString(ecdsaPrivateKey)
	if err != nil {
		panic(err)
	}

	ctx.SetCookie("jwt_token", tokenString, 3600, "/dashboard", "localhost", false, true)
	ctx.JSON(http.StatusAccepted, tokenString)
}

func Logout(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())

	query, err := fauna.FQL("LogoutUser()", map[string]any{})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, res)
}

func CreateTeam(ctx *gin.Context) {
	client := NewFaunaClient()
	userId := ctx.MustGet("UserId").(string)
	team := model.Team{}

	if err := ctx.ShouldBindJSON(&team); err != nil {
		log.Fatal(err)
	}

	team.Owner = userId

	query, err := fauna.FQL("Team.create(${team})", map[string]any{"team": team})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var Team model.Team

	if err := res.Unmarshal(&Team); err != nil {
		log.Fatal(err)
	}

	checkOwner, err := checkOwnerExist(userId)
	if err != nil {
		log.Fatal(err)
	}

	if !checkOwner {
		owner, err := createOwner(userId, Team.Id)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(owner)

		level, err := updateUserAccessLevel("Owner", userId)
		if err != nil {
			log.Fatal(err)
		}

		if level == "Owner" {
			fmt.Println("owner")
		}
	}

	ctx.JSON(http.StatusCreated, gin.H{"success": Team})
}

func checkOwnerExist(userId string) (bool, error) {
	client := NewFaunaClient()

	query, err := fauna.FQL("CheckOwnerExist(${userId})", map[string]any{"userId": userId})
	if err != nil {
		log.Fatal(err)
	}

	check, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var response bool

	if err := check.Unmarshal(&response); err != nil {
		log.Fatal(err)
	}

	return response, nil
}

func createOwner(userId string, teamId string) (model.Owner, error) {
	client := NewFaunaClient()

	query, err := fauna.FQL("CreateOwner(${userId},${teamId})", map[string]any{"userId": userId, "teamId": teamId})
	if err != nil {
		return model.Owner{}, err
	}

	res, err := client.Query(query)
	if err != nil {
		return model.Owner{}, err
	}
	var owner model.Owner

	if err := res.Unmarshal(&owner); err != nil {
		return model.Owner{}, err
	}

	return owner, nil
}

func updateUserAccessLevel(level string, userId string) (string, error) {
	client := NewFaunaClient()

	query, err := fauna.FQL(`User.byId(${userId}).updatedata({"AccessLevel":${level})`, map[string]any{"userId": userId, "level": level})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var user model.User

	if err := res.Unmarshal(&user); err != nil {
		log.Fatal(err)
	}

	return user.AccessLevel, nil
}

func GetOwner(ctx *gin.Context) {
	userId := ctx.MustGet("UserId").(string)
	client := NewFaunaClient()

	query, err := fauna.FQL("GetOwner(${userId})", map[string]any{"userId": userId})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(200, gin.H{"success": res.Data})
}

func CreateNotes(ctx *gin.Context) {
	client := NewFaunaClient()
	notes := model.Note{}

	if err := ctx.ShouldBindJSON(&notes); err != nil {
		log.Fatal(err)
	}

	query, err := fauna.FQL(`CreateNotes(${notes})`, map[string]any{"notes": notes})
	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(200, res.Data)
}

func UpdateNotes(ctx *gin.Context) {
	client := NewFaunaClient()
	note := model.Note{}

	if err := ctx.ShouldBindJSON(&note); err != nil {
		log.Fatal(err)
	}

	query, err := fauna.FQL(`UpdateNotes(${notes})`, map[string]any{"notes": note})
	if err != nil {
		log.Fatal(err)
	}

	resQuery, err := client.Query(query)
	if err != nil {
		log.Fatal(err)
	}

	var updateNotes model.Note

	if err := resQuery.Unmarshal(&updateNotes); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(200, updateNotes)
}

func DeleteNotes(ctx *gin.Context) {
	client := NewFaunaClient()
	notes := model.Note{}

	if err := ctx.ShouldBindJSON(&notes); err != nil {
		log.Fatal(err)
	}

	query, err := fauna.FQL(`notes.byNoteId(notesId)!.first()!.delete()`, map[string]any{"notesId": notes})

	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(query)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, res)
}

func DeleteTeam(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	team := model.Team{}

	if err := ctx.ShouldBindJSON(&team); err != nil {
		log.Fatal(err)
	}

	delete, err := fauna.FQL(`Team.byTeamId(${Id}).first()!.delete()`, map[string]any{"Id": team.Id})

	if err != nil {
		log.Fatal(err)
	}

	resQuery, err := client.Query(delete)

	if err != nil {
		log.Fatal(err)
	}

	var resTeam model.Team

	if err := resQuery.Unmarshal(&resTeam); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, resQuery)
}

func UpdateTeam(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())

	team := model.Team{}

	if err := ctx.ShouldBindJSON(&team); err != nil {
		log.Fatal(err)
	}

	query, err := fauna.FQL(`Team.byTeamId(${Id})`, map[string]any{"Id": team.Id})

	if err != nil {
		log.Fatal(err)
	}

	resQuery, err := client.Query(query)

	if err != nil {
		log.Fatal(err)
	}

	var newTeam model.Team

	if err := resQuery.Unmarshal(&newTeam); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, newTeam)
}