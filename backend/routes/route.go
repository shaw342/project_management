package routes

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/Middleware"
	repository "github.com/shaw342/projet_argile/backend/repository/Fauna"
)

func SetupRouter() *gin.Engine{
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:8080", "http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	expectedHost := "localhost:8080"
	r.Use(func(c *gin.Context) {
		log.Printf("Request Host: %s", c.Request.Host)
		if c.Request.Host != expectedHost {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
			return
		}
		c.Header("X-Frame-Options", "DENY")
		c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		c.Header("Referrer-Policy", "strict-origin")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
		c.Next()
	})

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, map[string]any{
			"hello": "world",
		})
	})

	v1 := r.Group("api/v1")
	{
		v1.GET("/welcome", Middleware.AuthMiddleware(), repository.Welcome)
		v1.POST("/login", repository.LoginUser)
		v1.POST("/register", repository.Register)
		v1.POST("/task/create", Middleware.AuthMiddleware(), repository.CreateTask)
		v1.POST("/task/:id", Middleware.AuthMiddleware(), repository.GetTask)
		v1.POST("/getUser", repository.GetUserByEmail)
		v1.POST("/project", Middleware.AuthMiddleware(), repository.CreateProject)
		v1.DELETE("/project/delete", Middleware.AuthMiddleware(), repository.DeleteProject)
		v1.DELETE("/task/delete", Middleware.AuthMiddleware(), repository.DeleteTask)
		v1.PATCH("/project/update", Middleware.AuthMiddleware(), repository.UpdateProject)
		v1.PATCH("/task/update", Middleware.AuthMiddleware(), repository.UpdateTasks)
		v1.GET("/task/get", Middleware.AuthMiddleware(), repository.GetTask)
		v1.GET("/project/:id", Middleware.AuthMiddleware(), repository.GetProject)
		v1.GET("/user/get", Middleware.AuthMiddleware(), repository.GetUser)
		v1.POST("/verifycode", Middleware.AuthMiddleware(), repository.CodeVerification)
		v1.GET("/all/projects", Middleware.AuthMiddleware(), repository.GetAllProjects)
		v1.POST("/team/create", Middleware.AuthMiddleware(), repository.CreateTeam)
		v1.POST("/team/all", Middleware.AuthMiddleware())
		v1.GET("/owner/get", Middleware.AuthMiddleware(), repository.GetOwner)
	}

	return r
}