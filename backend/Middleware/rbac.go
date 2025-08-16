package Middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaw342/projet_argile/backend/service"
)

func RbacMiddleware(permission string,userService *service.UserService) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		userEmail,err := ctx.Get("Email")

		if !err {

			ctx.AbortWithStatusJSON(http.StatusUnauthorized,"user email not found")
			return
		}

		if !userService.HasAcess(userEmail.(string),permission) {

			ctx.AbortWithStatusJSON(http.StatusForbidden,"error permission denied")
			return
		}

		ctx.Next()
	}
}