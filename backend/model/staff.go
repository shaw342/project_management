package model

import "github.com/google/uuid"

type Staff struct {
	Staff_id uuid.UUID `json:"staff_id"`
	User_id  uuid.UUID `json:"user_id"`
	Team_id  uuid.UUID `json:"team_id"`
}
