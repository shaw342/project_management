package model

type Note struct {
	NoteId  string `json:"noteId" fauna:"noteId"`
	UserId  string `json:"userId" fauna:"userId"`
	Title   string `json:"title" fauna:"title"`
	Content string `json:"content" fauna:"content"`
}
