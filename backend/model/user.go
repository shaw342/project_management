package model

type User struct {
	UserId      string `json:"UserId" fauna:"UserId"`
	Email       string `json:"email" fauna:"email"`
	FirstName   string `json:"firstName" fauna:"firstName"`
	LastName    string `json:"lastName" fauna:"lastName"`
	Password    string `json:"password" fauna:"password"`
	AccessLevel string `json:"accessLevel" fauna:"accessLevel"`
	Status      string `json:"status" fauna:"status"`
}
