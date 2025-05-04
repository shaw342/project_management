package verification

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"os"
	"time"

	"github.com/joho/godotenv"
	gomail "gopkg.in/gomail.v2"
)

func SendEmail(email string, num int) error {

	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	password := os.Getenv("EMAIL_SECRET")
	message := gomail.NewMessage()

	message.SetHeader("From", "iussulcompany@gmail.com")
	message.SetHeader("To", email)
	message.SetHeader("Subject", "first test")

	body := fmt.Sprintf(`<html>
	<body>
	<h1> This is your code %d 
	</body>
	
	</html>`, num)

	message.SetBody("text/html", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "iussulcompany@gmail.com", password)

	if err := dialer.DialAndSend(message); err != nil {
		return err
	}

	return nil
}

func GenerateRandNumber() int {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	number := rand.Intn(int(math.Pow(10, 9)))

	return number
}
