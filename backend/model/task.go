package model

type Task struct {
	TaskId  string `json:"taskId"`
	Name    string `json:"name"`
	Content string `json:"content"`
	Assign  string `json:"assign"`
	State   string `json:"state"`
}
