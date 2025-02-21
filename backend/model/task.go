package model

type Task struct {
	TaskId  string `json:"task_id" fauna:"task_id"`
	Name    string `json:"name" fauna:"name"`
	Content string `json:"content" fauna:"content"`
	State   string `json:"state" fauna:"state"`
}
