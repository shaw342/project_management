package model

type Note struct {
	Id      string `json:"id"`
	NoteId  string `json:"note_id"`
	UserId  string `json:"user_id"`
	Name    string `json:"Name"`
	Content string `json:"content"`
	Level   State  `json:"level"`
}
