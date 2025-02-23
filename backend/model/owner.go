package model

type Owner struct {
	OwnerId string    `json:"owner_id" fauna:"owner_id"`
	User    User      `json:"user" fauna:"user"`
	Team    []Manager `json:"team" fauna:"team"`
	Project []Project `json:"project" fauna:"project"`
}
