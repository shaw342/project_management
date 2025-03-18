package model

type User struct {
	UserId      string `json:"UserId"`
	Email       string `json:"email"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Password    string `json:"password"`
	AccessLevel string `json:"accessLevel"`
	Status      string `json:"status"`
}
