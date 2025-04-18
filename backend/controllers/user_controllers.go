package controllers

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
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

	ctx.JSON(http.StatusCreated, result)
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
