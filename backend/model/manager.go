package model

import "github.com/google/uuid"

type Manager struct {
	ManagerId uuid.UUID `json:"manager_id"`
	UserId    uuid.UUID `json:"user_id"`
}
