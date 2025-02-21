package model

type Notes struct {
	NotesId string
	User    User   `json:"user" fauna:"user"`
	Title   string `json:"title" fauna:"title"`
	Content string `json:"content" fauna:"content"`
	Task    string `json:"task" fauna:"task"`
}
