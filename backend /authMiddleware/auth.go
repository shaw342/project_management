package authMiddleware

import "github.com/gin-gonic/gin"

func authMiddleware() gin.HandlerFunc{
	return func(ctx *gin.Context)  {
		tokenString := ctx.GetHeader("Authorization")

		if tokenString == ""{
			ctx.JSON(401, gin.H{"error": "Unauthorized"})
            ctx.Abort()
            return
		}

		
	}
}