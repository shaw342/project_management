package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)
var secretKey = []byte("secret-key")

func CreateJwtToken(username string) (string, error){
	err := godotenv.Load()

	if err != nil{
		panic("probleme with key")
	}

	secretKey = os.Getenv("SECRET")
	if secretKey == ""{
		return "",fmt.Errorf("secret key is empty")
	}
	fmt.Print(secretKey)
	token := jwt.NewWithClaims(jwt.SigningMethodES256,jwt.MapClaims{
		"username":username,
		"exp": time.Now().Add(time.Hour * 1).Unix(), 
	})

	tokenString ,err := token.SignedString(secretKey)

	if err != nil {
		return "",err
	}

	return tokenString,nil
}