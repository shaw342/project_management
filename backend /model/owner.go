package model

type Owner struct {
	Id      string    `json:"id" fauna:"id"`
	User    User      `json:"user" fauna:"user"`
	Team    []Team    `json:"team" fauna:"team"`
	Project []Project `json:"project" fauna:"project"`
}
