package model

type User struct {
	Id          string `json:"id" fauna:"id"`
	Email       string `json:"email" fauna:"email"`
	FirstName   string `json:"firstName" fauna:"firstName"`
	LastName    string `json:"lastName" fauna:"lastName"`
	Password    string `json:"password" fauna:"password"`
	AccessLevel string `json:"accessLevel" fauna:"accessLevel"`
	Status      string `json:"status" fauna:"status"`
}
