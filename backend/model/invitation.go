package model

type Invitation struct {
	Id             string `json:"id"`
	TeamID         string `json:"teamId"`
	TeamName       string `json:"teamName"`
	SenderID       string `json:"senderId"`
	SenderName     string `json:"senderName"`
	SenderEmail    string `json:"senderEmail"`
	SenderAvatar   string `json:"senderAvatar"`
	RecipientEmail string `json:"recipientEmail"`
	Message        string `json:"message"`
	Status         string `json:"status"`
}
