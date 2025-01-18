package verification

import (
	"fmt"
	"math/rand"
	"net/smtp"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const letter = "azertyuiopqsdfghjklmwxcvbn"

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

	rand.NewSource((time.Now().UnixNano()))

	length := 10

	randomString := generateRandomString(length)

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	message := []byte("This is your code :" + randomString)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	fmt.Println("Email Sent Successfully!")

	return "Email sent Successfully", nil
}

func generateRandomString(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}
