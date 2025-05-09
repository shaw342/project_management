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
	teamName := model.Team{}
	userEmail := ctx.MustGet("Email").(string)
	

	if err := ctx.ShouldBindJSON(&teamName); err != nil {
		log.Fatal(err)
	}


	user, err := c.service.GetUser(userEmail)

	if err != nil{
		log.Fatal(err)
	}
	data := model.Manager{
		UserId: user.UserId,
	}	

	manager,err := c.service.CreateManager(data)

	if err != nil{
		log.Fatal(err)
	}

	team := model.Team{
		Id:        teamName.Id,
		Name:      teamName.Name,
		ManagerId: manager.ManagerId,
	}

	result, err := c.service.CreateTeam(team)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)
}
