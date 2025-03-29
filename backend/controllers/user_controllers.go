package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/service"
)

type UserController struct {
	userService *service.UserService
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

	fmt.Println(check)

	if check == true {
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
