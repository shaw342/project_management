package model

type Team struct {
	Id      string `json:"Id"`
	Name    string `json:"name"`
	TeamId  string `json:"team_id"`
	OwnerId string `json:"owner_id"`
}
