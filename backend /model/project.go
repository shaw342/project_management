package model

type Project struct {
	Id    string   `json:"id"`
	Name  string   `json:"name"`
	Owner string   `json:"owner"`
	Tasks []string `json:"tasks"`
}
