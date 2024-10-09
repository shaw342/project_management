package model

type Task struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Content string `json:"content"`
	State string `json:"state"`
}