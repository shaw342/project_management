package verification

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	gomail "gopkg.in/gomail.v2"
)

func SendEmail(email string) (string, error) {

	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	password := os.Getenv("EMAIL_SECRET")
	message := gomail.NewMessage()

	message.SetHeader("From", "iussulcompany@gmail.com")
	message.SetHeader("To", email)
	message.SetHeader("Subject", "first test")

	message.SetBody("text/plaine", "This is the Test ")

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "iussulcompany@gmail.com", password)

	if err := dialer.DialAndSend(message); err != nil {
		return "", err
	}

	return email, nil
}
