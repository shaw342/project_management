package model

type Owner struct {
	OwnerId string    `json:"id" fauna:"id"`
	User    User      `json:"user" fauna:"user"`
	Team    []Manager `json:"team" fauna:"team"`
	Project []Project `json:"project" fauna:"project"`
}
