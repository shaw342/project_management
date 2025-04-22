package model

type State string

const (
	NotStarted State = "Not Started"
	InProgress State = "In Progress"
	Completed  State = "Completed"
	OnHold     State = "On Hold"
)
