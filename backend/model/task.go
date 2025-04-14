package model

import "time"

type Task struct {
	TaskId   string    `json:"task_id"`
	Name     string    `json:"name"`
	Content  string    `json:"content"`
	Assign   string    `json:"assign"`
	State    string    `json:"state"`
	CreateAt time.Time `json:"creatat"`
}
