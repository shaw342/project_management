package routes

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/controllers"
	"github.com/shaw342/projet_argile/backend/service"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	r := gin.Default()

	gin.SetMode(gin.DebugMode)
	userService := service.NewUserService(db)
	managerService := service.NewManagerService(db)
	userController := controllers.NewUserController(userService)
	managerController := controllers.NewMangerController(managerService)

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

	v1 := r.Group("api/v1")
	{
		v1.POST("register", userController.Register)
		v1.GET("welcome", userController.Welcome)
		v1.PATCH("user/:id/update")
		v1.DELETE("user/:id/delete")
		v1.POST("check", userController.CheckUser)
		v1.GET("user/get", userController.GetUser)
		v1.POST("login", userController.Login)
		v1.POST("task/create", managerController.CreateTask)
	}

	return r
}
