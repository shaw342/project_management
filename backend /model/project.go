package model

type Project struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Owner       Owner  `json:"owner"`
	Tasks       []Task `json:"tasks,omitempty"`
	Teams       []Team `json:"teams,omitempty"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}
