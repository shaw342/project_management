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
		ctx.JSON(404, ctx.Errors)
		return
	}

	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		fmt.Print(user)
		log.Fatal("all field is not completed")
	}

	fmt.Println(user.FirstName)

	user.Id = uuid.New().String()

	createUser, err := fauna.FQL(`UserSignup(${Id},${FirstName},${LastName},${Email},${Password})`, map[string]any{"Id": user.Id, "FirstName": user.FirstName, "LastName": user.LastName, "Email": user.Email, "Password": user.Password})

	if err != nil {
		log.Fatal(err)
	}

	res, err := client.Query(createUser)
	if err != nil {
		panic(err)
	}

	ctx.JSON(201, res.Data)

}

func CreateTask(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	task := model.Task{}

	if err := ctx.ShouldBindJSON(&task); err != nil {
		ctx.JSON(404, ctx.Errors)
		return
	}

	task.Id = uuid.NewString()
	createTask, err := fauna.FQL(`Task.create(${task})`, map[string]any{"task": task})

	if err != nil {
		panic(err)
	}

	res, err := client.Query(createTask)
	if err != nil {
		panic(err)
	}

	var scout model.Task

	if err := res.Unmarshal(&scout); err != nil {
		panic(err)
	}

	ctx.JSON(200, scout)
}

func CreateProject(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	project := model.Project{}

	if err := ctx.ShouldBindJSON(&project); err != nil {
		ctx.JSON(404, ctx.Errors)
		return
	}

	createProject, err := fauna.FQL("Projects.create(${project})", map[string]any{"project": project})

	if err != nil {
		panic(err)
	}

	res, err := client.Query(createProject)
	if err != nil {
		log.Fatal("failed run query")
	}

	var scout model.Project

	if err := res.Unmarshal(&scout); err != nil {
		panic(err)
	}

	fmt.Println(scout.Name)

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

	query, err := fauna.FQL("User.byUserId(${userId}).first()", map[string]any{"userId": userId})

	if err != nil {
		log.Fatal(err)
	}

	res, _ := client.Query(query)

	var user model.User
	if err := res.Unmarshal(&user); err != nil {
		log.Fatal(err)
	}
	fmt.Println(user)
	ctx.JSON(http.StatusOK, user)
}

func UpdateProject(ctx *gin.Context) {
	token := ctx.MustGet("token").(string)
	client := fauna.NewClient(token, fauna.DefaultTimeouts())
	project := model.Project{}

	if err := ctx.ShouldBindJSON(&project); err != nil {
		panic(err)
	}

	query, _ := fauna.FQL(`Projects.byUserId(${Id}).first()!.update(${project})`, map[string]any{"Id": project.Id, "project": project})

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
		ctx.JSON(404, err)
	}

	query, _ := fauna.FQL(`Task.byName(${name}).first()!.update(${task})`, map[string]any{"Id": task.Id, "task": task})

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
	client := NewFaunaClient()
	data := model.User{}
	if err := ctx.ShouldBindJSON(&data); err != nil {
		panic(err)
	}
	query, _ := fauna.FQL(`User.byName(${name}).first()`, map[string]any{"name": data.FirstName})

	res, _ := client.Query(query)

	var scout model.Project

	if err := res.Unmarshal(&scout); err != nil {
		ctx.JSON(404, err)
	}
	ctx.JSON(200, scout.Name)
}

func CreatCredential(Id string, Password string) *fauna.QuerySuccess {
	client := NewFaunaClient()
	query, _ := fauna.FQL("Credential.create({document:User.byId(${Id}),password:${password}})", map[string]any{"Id": Id, "password": Password})
	res, err := client.Query(query)
	if err != nil {
		panic(err)
	}
	return res
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

func GetProject(ctx *gin.Context) {
	client := NewFaunaClient()
	Project := model.Project{}

	if err := ctx.ShouldBindJSON(&Project); err != nil {
		panic(err)
	}
	query, err := fauna.FQL(`Project.byName(${name}).first()`, map[string]any{"name": Project.Name})

	if err != nil {
		panic(err)
	}
	res, err := client.Query(query)

	if err != nil {
		panic(err)
	}
	var result model.Project
	if err := res.Unmarshal(result); err != nil {
		panic(err)
	}
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

	userData, err := fauna.FQL("User.byEmail(${email}).first()", map[string]any{"email": user.Email})

	if err != nil {
		log.Fatal(err)
	}

	resUser, err := client.Query(userData)

	if err != nil {
		log.Fatal("error to run query")
	}

	var result model.User

	if err := resUser.Unmarshal(&result); err != nil {
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
	var faunaToken model.Token

	if err := res.Unmarshal(&faunaToken); err != nil {
		log.Fatalf("failed to Unmarshal data")
	}

	fmt.Println(faunaToken)

	token := jwt.NewWithClaims(jwt.SigningMethodES256, jwt.MapClaims{
		"Issuer": result.Id,
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
