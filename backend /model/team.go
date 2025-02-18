package model

type Team struct {
	Id     string  `json:"id" fauna:"id"`
	Name   string  `json:"name" fauna:"name"`
	Staffs []Staff `json:"staffs" fauna:"staffs"`
	Owner  string  `json:"owner" fauna:"owner"`
}
