package model

type Team struct {
	Id      string `json:"Id"`
	Name    string `json:"name"`
	Owner   string `json:"owner_id"`
	Members []User `json:"members"`
}
