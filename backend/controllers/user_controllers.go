package controllers

import (
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

	}

	result, err := c.userService.CreateUser(user)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)

}
