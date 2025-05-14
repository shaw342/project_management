package model

import "github.com/google/uuid"

type User struct {
	UserId    uuid.UUID `json:"user_id"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Password  string    `json:"password"`
	Status    string    `json:"status"`
	CreateAt  string    `json:"createat"`
}
