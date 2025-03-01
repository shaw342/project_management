package model

type Task struct {
	TaskId  string `json:"taskId" fauna:"taskId"`
	Name    string `json:"name" fauna:"name"`
	Content string `json:"content" fauna:"content"`
	Assign  string `json:"assign" fauna:"assign"`
	State   string `json:"state" fauna:"State"`
}
