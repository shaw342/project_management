package verification

import (
	"crypto/rand"
	"fmt"
	"log"
	"math/big"
	"net/smtp"
	"os"

	"github.com/joho/godotenv"
)

func SendMail(email string) (string, error) {
	er := godotenv.Load()
	if er != nil {
		panic(er)
	}

	from := os.Getenv("EMAIL")
	password := os.Getenv("PASSWORD")

	to := []string{
		email,
	}

	length := 10

	randomString, er := GenerateVerificationCode(length)

	if er != nil {
		log.Fatal(er)
	}

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	subject := "Code de vérification"
	message := fmt.Sprintf("From: %s\nTo: %s\nSubject: %s\n\nThis is your code: %s", from, email, subject, randomString)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte(message))

	if err != nil {
		fmt.Println(err)
		return "", err
	}
	fmt.Println("Email Sent Successfully!")

	return randomString, nil
}

func GenerateVerificationCode(length int) (string, error) {
	codeLength := length
	max := big.NewInt(10) // Les chiffres vont de 0 à 9

	var code string
	for i := 0; i < codeLength; i++ {
		num, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}
		code += fmt.Sprintf("%d", num.Int64())
	}

	return code, nil
}
