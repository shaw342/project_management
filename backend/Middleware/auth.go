package Middleware

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"

	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var ecdsaPublicKey *ecdsa.PublicKey

func init() {
	publicKeyData, err := os.ReadFile("ecdsa_public_key.pem")
	if err != nil {
		panic("error failed read public key  : " + err.Error())
	}

	pubBlock, _ := pem.Decode(publicKeyData)
	if pubBlock == nil || pubBlock.Type != "PUBLIC KEY" {
		panic("invalid ECDSA public key")
	}

	publicKey, err := x509.ParsePKIXPublicKey(pubBlock.Bytes)
	if err != nil {
		panic("error to convert pubkic key: " + err.Error())
	}

	var ok bool
	ecdsaPublicKey, ok = publicKey.(*ecdsa.PublicKey)
	if !ok {
		panic("invalid ECDSA public key: ligne 2")
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		err := godotenv.Load()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error loading env variable"})
			ctx.Abort()
			return
		}

		authorization := ctx.Request.Header.Get("Authorization")
		if authorization == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			ctx.Abort()
			return
		}

		token := strings.Split(authorization, " ")
		if len(token) != 2 || token[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalide header format"})
			ctx.Abort()
			return
		}

		Email, err := VerifyToken(token[1])
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			ctx.Abort()
			return
		}
		ctx.Set("Email", Email)
		ctx.Next()
	}
}

func VerifyToken(tokenString string) (string, error) {
	err := godotenv.Load()
	if err != nil {
		return "", fmt.Errorf("problem with key: %v", err)
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return ecdsaPublicKey, nil
	})
	if err != nil {
		return "", fmt.Errorf("error parde token : %v", err)
	}

	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("error extract the claims")
	}

	Email, ok := claims["Issuer"].(string)
	if !ok {
		return "", fmt.Errorf("not found UserId")
	}

	return Email, nil
}
