package model

import "time"

type Task struct {
	TaskId   string    `json:"task_id"`
	Name     string    `json:"name"`
	Content  string    `json:"content"`
	Assign   string    `json:"assign"`
	State    State     `json:"state"`
	Level    Level     `json:"level"`
	CreateAt time.Time `json:"creatat"`
}
