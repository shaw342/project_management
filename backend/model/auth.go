package model

type Auth struct {
	Email string `json:"email" fauna:"email"`
}
