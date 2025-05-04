package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/service"
)

type ManagerController struct {
	service *service.ManagerService
}

func NewMangerController(service *service.ManagerService) *ManagerController {
	return &ManagerController{service: service}
}

func (c *ManagerController) CreateTask(ctx *gin.Context) {
	task := model.Task{}

	if err := ctx.ShouldBindJSON(&task); err != nil {
		log.Fatal(err)
	}
	result, err := c.service.CreateTask(task)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, gin.H{"successFull": result})
}

func (c *ManagerController) CreateTeam(ctx *gin.Context) {
	team := model.Team{}

	if err := ctx.ShouldBindJSON(&team); err != nil {
		log.Fatal(err)
	}

	result, err := c.service.CreateTeam(team)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)
}
