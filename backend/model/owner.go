package model

type Owner struct {
	Id        string    `json:"id" fauna:"id"`
	FirstName string    `json:"firstName" fauna:"firstName"`
	LastName  string    `json:"lastName" fauna:"lastName"`
	Email     string    `json:"email" fauna:"email"`
	Team      []Manager `json:"team" fauna:"team"`
	Project   []Project `json:"project" fauna:"project"`
}
