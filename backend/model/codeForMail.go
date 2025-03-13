package model

type CodeForMail struct {
	Id    string `json:"id" fauna:"id"`
	Code  string `json:"code" fauna:"code"`
	Email string `json:"email" fauna:"email"`
}
