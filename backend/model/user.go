package model

type User struct {
	UserId    []uint8 `json:"user_id"`
	Email     string  `json:"email"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	Password  string  `json:"password"`
	Status    string  `json:"status"`
	CreateAt  string  `json:"createat"`
}
