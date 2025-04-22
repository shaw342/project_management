package model

type State string

const (
	NotStarted State = "Not Started"
	InProgress State = "In Progress"
	Completed  State = "Completed"
	OnHold     State = "On Hold"
)

type Level string

const (
	High     Level = "High"
	Medium   Level = "Medium"
	Low      Level = "Level"
	Undefind Level = "Undefind"
)
