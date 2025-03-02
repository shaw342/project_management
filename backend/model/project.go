package model

type Project struct {
	ProjectId   string `json:"projectId" fauna:"projectId"`
	Name        string `json:"name" fauna:"name"`
	Description string `json:"description" fauna:"description"`
	Owner       Owner  `json:"owner" fauna:"owner"`
	Tasks       []Task `json:"tasks,omitempty" fauna:"tasks"`
	Teams       []Team `json:"teams" fauna:"teams"`
	StartDate   string `json:"startDate" fauna:"startDate"`
	EndDate     string `json:"endDate" fauna:"endDate"`
}
