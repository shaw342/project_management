package model

import "github.com/google/uuid"

type Team struct {
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	TeamId    uuid.UUID `json:"team_id"`
	ManagerId uuid.UUID `json:"manager_id"`
}
