package model

type Team struct {
	Id      string `json:"Id"`
	Name    string `json:"name"`
	OwnerId string `json:"owner_id"`
}
