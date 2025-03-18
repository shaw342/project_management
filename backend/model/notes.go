package model

type Note struct {
	NoteId  string `json:"noteId"`
	UserId  string `json:"userId"`
	Title   string `json:"title"`
	Content string `json:"content"`
}
