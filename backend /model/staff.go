package model

type Staff struct {
	Id    string `json:"id" fauna:"id"`
	User  User   `json:"user" fauna:"user"`
	Team  Team   `json:"team" fauna:"team"`
	Owner Owner  `json:"owner" fauna:"owner"`
}
