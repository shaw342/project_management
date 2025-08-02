package controllers

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"log"
	"net/http"
	"os"
	"time"

	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	verification "github.com/shaw342/projet_argile/backend/Verification"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/service"
	"golang.org/x/crypto/bcrypt"
)

var ecdsaPrivateKey *ecdsa.PrivateKey

type UserController struct {
	userService *service.UserService
}

func init() {
	keyData, err := os.ReadFile("ecdsa_private_key.pem")

	if err != nil {
		log.Fatal(err)
	}

	block, _ := pem.Decode(keyData)

	if block == nil || block.Type == "PRIVATE KEY" {
		log.Fatal(err)
	}

	ecdsaPrivateKey, err = x509.ParseECPrivateKey(block.Bytes)

	if err != nil {
		log.Fatal(err)
	}
}

func NewUserController(userService *service.UserService) *UserController {
	return &UserController{userService: userService}
}

func (c *UserController) Register(ctx *gin.Context) {
	user := model.User{}

	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Fatal(err)
		return
	}

	check, err := c.userService.CheckUser(user.Email)

	if err != nil {
		log.Fatal(err)
	}

	if check {
		ctx.JSON(http.StatusAccepted, gin.H{"server": "user already exist"})
		return
	}

	result, err := c.userService.CreateUser(user)

	if err != nil {
		log.Fatal(err)
	}

	code := verification.GenerateRandNumber()

	mailCode := model.CodeForMail{
		Code:  fmt.Sprint(code),
		Email: result.Email,
	}

	saveCodeId, err := c.userService.SaveMailCode(mailCode)

	if err != nil {
		log.Fatal(err)
	}

	emailErr := verification.SendEmail(result.Email, code)

	if emailErr != nil {
		log.Fatal(err)
	}


	ctx.JSON(http.StatusCreated, gin.H{"success": saveCodeId})
}

func (c *UserController) Welcome(ctx *gin.Context) {
	email, err := ctx.Get("Email")

	if !err {
		log.Fatal("connot find email")
	}

	response, getUserErr := c.userService.GetUser(email.(string))


	if getUserErr != nil {
		log.Fatal(getUserErr)
	}

	ctx.JSON(200, response)
}

func (c *UserController) GetAll(ctx *gin.Context) {
	user := model.User{}

	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, gin.H{"hello": "world"})
}

func (c *UserController) CheckUser(ctx *gin.Context) {
	user := model.User{}

	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Fatal(err)
	}
	result, er := c.userService.CheckUser(user.Email)

	if er != nil {
		log.Fatal(er)
	}

	ctx.JSON(http.StatusAccepted, result)
}

func (c *UserController) Login(ctx *gin.Context) {
	auth := model.Auth{}
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	if err := ctx.ShouldBindJSON(&auth); err != nil {
		log.Fatal(err)
	}

	check, err := c.userService.CheckUser(auth.Email)

	fmt.Println(check)

	if err != nil {
		log.Fatal(err)
	}

	if !check {
		ctx.JSON(http.StatusAccepted, gin.H{"user": "not found"})
		return
	}

	password, err := c.userService.GetAuth(auth.Email)
	if err != nil {
		log.Fatal(err)
	}

	existErro := bcrypt.CompareHashAndPassword([]byte(password), []byte(auth.Password))

	if existErro != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "wrong password"})
		return
	}

	user, err := c.userService.GetUser(auth.Email)

	if err != nil {
		log.Fatal(err)
	}

	claims := &jwt.MapClaims{
		"exp":    jwt.NewNumericDate(time.Now().Add(time.Hour * 1)).Unix(),
		"Issuer": user.Email,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)

	tokenString, err := token.SignedString(ecdsaPrivateKey)

	if err != nil {
		log.Fatal(err)
	}


	ctx.SetCookie("access_token", tokenString, 3600, "/", "localhost", false, true)
	ctx.JSON(http.StatusAccepted, tokenString)
}

func (c *UserController) GetUser(ctx *gin.Context) {
	var user model.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Fatal(err)
	}

	user, err := c.userService.GetUser(user.Email)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, user)
}

func (c *UserController) CreateNote(ctx *gin.Context) {
	note := model.Note{}

	if err := ctx.ShouldBindJSON(&note); err != nil {
		log.Fatal(err)
	}

	note, err := c.userService.CreateNote(note)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, note)
}

func (c *UserController) CreateOwner(ctx *gin.Context) {
	owner := model.Owner{}

	if err := ctx.ShouldBindJSON(&owner); err != nil {
		log.Fatal(err)
	}

	result, err := c.userService.CreateOwner(owner)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)
}

func (c *UserController) GetEmailCode(ctx *gin.Context) {

	mail_code_id := ctx.Param("id")

	fmt.Println(mail_code_id)

	response, err := c.userService.GetMailCode(mail_code_id)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, response)
}

func (c *UserController) DeleteEmailCode(ctx *gin.Context) {
	id := ctx.Param("id")

	delete, err := c.userService.DeleteMailCode(id)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, gin.H{"response": delete})
}

func (c *UserController) Logout(ctx *gin.Context) {

	ctx.SetCookie(
		"jwt_token",
		"",
		-1,
		"/",
		"localhost",
		false,
		true,
	)
	ctx.JSON(http.StatusOK, "Logout successful")
}

func (c *UserController) GetAllInvitation(ctx *gin.Context) {
	email := ctx.MustGet("Email").(string)

	result, err := c.userService.GetInvitation(email)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *UserController) IsReadInvitation(ctx *gin.Context) {
	id := uuid.MustParse(ctx.Param("id"))

	result, err := c.userService.IsRead(id)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, result)
}

func (c *UserController) DeclineInvitation(ctx *gin.Context) {
	id := uuid.MustParse(ctx.Param("id"))

	err := c.userService.DeclinedInvitation(id)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, true)
}

func (c *UserController) AcceptInvitation(ctx *gin.Context) {
	id := uuid.MustParse(ctx.Param("id"))
	team := model.Team{}
	email := ctx.MustGet("Email").(string)

	if err := ctx.ShouldBindJSON(&team); err != nil {
		log.Fatal(err)
	}

	err := c.userService.AcceptInvitation(id)

	if err != nil {
		log.Fatal(err)
	}

	user, err := c.userService.GetUser(email)

	if err != nil {
		log.Fatal(err)
	}

	staffModel := model.Staff{
		User_id: user.UserId,
		Team_id: team.TeamId,
	}

	staff, err := c.userService.CreateStaff(staffModel)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, staff)
}

func (c *UserController) ResendEmail(ctx *gin.Context) {
	id, err := ctx.Cookie("mail_code_id")

	if err != nil {
		log.Fatal(err)
	}

	newCode := verification.GenerateRandNumber()

	result, err := c.userService.UpdateEmail(id, newCode)

	if err != nil && !result {
		log.Fatal(err)
	}

	if !result {
		log.Fatal("erro to update")
	}

	ctx.JSON(http.StatusAccepted, result)
}