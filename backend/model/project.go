package model

import (
	"time"
)

type Project struct {
	ProjectId   string    `json:"project_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Status      State     `json:"status"`
	OwnerId     string    `json:"owner_id"`
	ManagerId   string    `json:"manager_id"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
}
