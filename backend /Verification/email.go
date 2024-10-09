package verification

import (
	"github.com/wneessen/go-mail"
	"log"
)

func SendMail(email string) {
	m := mail.NewMsg()
	if err := m.From("toni.sender@example.com"); err != nil {
		log.Fatalf("failed to set From address: %s", err)
	}
	if err := m.To("tina.recipient@example.com"); err != nil {
		log.Fatalf("failed to set To address: %s", err)
	}
	m.Subject("This is my first mail with go-mail!")
	m.SetBodyString(mail.TypeTextPlain, "Do you like this mail? I certainly do!")
	c, err := mail.NewClient("smtp.example.com", mail.WithPort(25), mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername("my_username"), mail.WithPassword("extremely_secret_pass"))
	if err != nil {
		log.Fatalf("failed to create mail client: %s", err)
	}
	if err := c.DialAndSend(m); err != nil {
		log.Fatalf("failed to send mail: %s", err)
	}
}