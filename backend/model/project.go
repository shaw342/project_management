package model

type Project struct {
	ProjectId   string `json:"projectId"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Owner       Owner  `json:"owner"`
	Tasks       []Task `json:"tasks,omitempty"`
	Teams       []Team `json:"teams"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}
