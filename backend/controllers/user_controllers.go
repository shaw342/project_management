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
	if saveCodeId == "" {
		log.Fatal("empty id")
	}

	emailErr := verification.SendEmail(result.Email, code)

	if emailErr != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, gin.H{"code": saveCodeId})
}

func (c *UserController) Welcome(ctx *gin.Context) {
	ctx.JSON(200, "hello")
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
	password, err := c.userService.GetAuth(auth.Email)

	if err != nil {
		log.Fatal(err)
	}

	existErro := bcrypt.CompareHashAndPassword([]byte(password), []byte(auth.Password))

	if existErro != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"eror": "wrong password"})
	}

	claims := &jwt.MapClaims{
		"exp":    jwt.NewNumericDate(time.Now().Add(time.Hour * 1)).Unix(),
		"issuer": "test",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)

	tokenString, err := token.SignedString(ecdsaPrivateKey)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, gin.H{"success": tokenString})
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

func (c *UserController) CreateManager(ctx *gin.Context) {
	manager := model.Manager{}

	if err := ctx.ShouldBindJSON(&manager); err != nil {
		log.Fatal(err)
	}

	if manager.OwnerId == "" {
		log.Fatal("missing owner id")
	}

	if manager.UserId == "" {
		log.Fatal("mising user id")
	}

	result, err := c.userService.CreateManager(manager)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)
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
