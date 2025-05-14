package model

import (
	"time"

	"github.com/google/uuid"
)

type Project struct {
	ProjectId   uuid.UUID `json:"project_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Status      State     `json:"status"`
	ManagerId   uuid.UUID `json:"manager_id"`
	StartDate   time.Time `json:"startDate"`
	TeamId      string    `json:"team_id"`
	EndDate     time.Time `json:"endDate"`
}
