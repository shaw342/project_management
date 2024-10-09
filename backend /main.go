package main

import (
	"net/http"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/repository/Fauna"
)



func main() {
	r := gin.New()


	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:8080", "http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))
	expectedHost := "localhost:8080"
	r.Use(func(c *gin.Context) {
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
		v1.POST("/login",repository.Login)
		v1.POST("/user", repository.CreateUser)
		v1.POST("/task", repository.CreateTask)
		v1.POST("/getUser",repository.GetUserByEmail)
		v1.POST("/project", repository.CreateProject)
		v1.DELETE("/deleteProject",repository.DeleteProject)
		v1.DELETE("/deleteTask",repository.DeleteTask)
		v1.PATCH("/updateProject",repository.UpdateProject)
		v1.PATCH("/updateTask",repository.UpdateTasks)
		v1.GET("/task/get",repository.GetTask)
		v1.GET("/project/get",repository.GetProject)
		v1.GET("/user/get",repository.GetUser)
	}

	r.Run()
}
