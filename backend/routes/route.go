package routes

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/Middleware"
	"github.com/shaw342/projet_argile/backend/controllers"
	"github.com/shaw342/projet_argile/backend/service"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	r := gin.New()

	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	r.Use(gin.Recovery())

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
		v1.GET("welcome", Middleware.AuthMiddleware(), userController.Welcome)
		v1.PATCH("user/:id/update")
		v1.DELETE("user/:id/delete")
		v1.POST("check", userController.CheckUser)
		v1.GET("user/get", userController.GetUser)
		v1.POST("login", userController.Login)
		v1.POST("logout", Middleware.AuthMiddleware(), userController.Logout)
		v1.POST("task/create", Middleware.AuthMiddleware(), managerController.CreateTask)
		v1.POST("note/create", userController.CreateNote)
		v1.POST("user/owner/create", userController.CreateOwner)
		v1.POST("user/get/code", userController.GetEmailCode)
		v1.POST("user/team/create", Middleware.AuthMiddleware(), managerController.CreateTeam)
		v1.DELETE("user/email/code/:id", userController.DeleteEmailCode)
		v1.POST("team/invitations", Middleware.AuthMiddleware(), managerController.CreateInvitation)
		v1.POST("team/:name", Middleware.AuthMiddleware())
		v1.GET("projects/all",Middleware.AuthMiddleware(),)
		v1.POST("projects/create", Middleware.AuthMiddleware(), managerController.CreateProject)
		v1.GET("invitation/get/all", Middleware.AuthMiddleware(), userController.GetAllInvitation)
		v1.GET("user/team/all", Middleware.AuthMiddleware(), managerController.GetAllTeam)
		v1.GET("get/team/status/all", Middleware.AuthMiddleware(), managerController.GetInvitationsStatus)
		v1.PATCH("invitations/:id/read", Middleware.AuthMiddleware(), userController.IsReadInvitation)
		v1.POST("invitations/:id/decline", Middleware.AuthMiddleware(), userController.DeclineInvitation)
		v1.POST("invitations/:id/accepted", Middleware.AuthMiddleware(), userController.AcceptInvitation)
		v1.GET("/search", Middleware.AuthMiddleware(), managerController.Search)
	}

	return r
}
