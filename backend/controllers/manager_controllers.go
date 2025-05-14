package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	if err != nil {
		log.Fatal(err)
	}
	data := model.Manager{
		UserId: user.UserId,
	}

	manager, err := c.service.CreateManager(data)

	if err != nil {
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

func (c *ManagerController) Search(ctx *gin.Context) {
	query := ctx.Query("q")

	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	result, err := c.service.Search(query)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *ManagerController) GetAllTeam(ctx *gin.Context) {
	email := ctx.MustGet("Email").(string)

	user, err := c.service.GetUser(email)

	if err != nil {
		log.Fatal(err)
	}

	allTeam, err := c.service.GetAllTeam(user.UserId)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusAccepted, allTeam)
}

func (c *ManagerController) GetTeam(ctx *gin.Context) {
	teamName := ctx.Param("name")

	if err := ctx.ShouldBindJSON(&teamName); err != nil {
		log.Fatal(err)
	}

	result, err := c.service.GetTeam(teamName)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *ManagerController) CreateInvitation(ctx *gin.Context) {
	invitation := model.Invitation{}
	email := ctx.MustGet("Email").(string)

	if err := ctx.ShouldBindJSON(&invitation); err != nil {
		log.Fatal(err)
	}

	if invitation.RecipientEmail == "" {
		log.Fatal("empty")
	}
	user, err := c.service.GetUser(email)

	if err != nil {
		log.Fatal(err)
	}

	team, err := c.service.GetTeam(invitation.TeamName)

	if err != nil {

		log.Fatal(err)
	}

	invite := model.Invitation{
		TeamId:         team.TeamId,
		TeamName:       invitation.TeamName,
		SenderName:     user.FirstName + " " + user.LastName,
		SenderEmail:    user.Email,
		RecipientEmail: invitation.RecipientEmail,
		Message:        invitation.Message,
	}
	fmt.Println(invite)

	result, err := c.service.CreateInvitation(invite)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusCreated, result)
}

func (c *ManagerController) GetInvitationsStatus(ctx *gin.Context) {
	email := ctx.MustGet("Email").(string)

	result, err := c.service.GetAllInvitationStatus(email)

	if err != nil {
		log.Fatal(err)
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *ManagerController) CreateProject(ctx *gin.Context) {
	project := model.Project{}

	if err := ctx.ShouldBindJSON(&project); err != nil {
		log.Fatal(err)
	}

	team, err := c.service.GetTeamByTeamId(uuid.MustParse(project.TeamId))

	if err != nil {
		log.Fatal(err)
	}

	project.ManagerId = team.ManagerId

	user, err := c.service.GetUserNameByManagerId(project.ManagerId)

	if err != nil {
		log.Fatal(err)
	}

	result, err := c.service.CreateProject(project)

	if err != nil {
		log.Fatal(err)
	}

	response := map[string]any{
		"project_id":  result.ProjectId,
		"name":        result.Name,
		"description": result.Description,
		"status":      result.Status,
		"endDate":     result.EndDate,
		"startDate":   result.StartDate,
		"manager":     user.FirstName + " " + user.LastName,
		"teams":       team.Name,
	}

	ctx.JSON(http.StatusCreated, response)
}