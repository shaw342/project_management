package model

import (
	"time"

	"github.com/google/uuid"
)

type Invitation struct {
	Id             uuid.UUID `json:"id"`
	TeamId         uuid.UUID `json:"team_id"`
	TeamName       string    `json:"team_name"`
	SenderName     string    `json:"sender_name"`
	SenderEmail    string    `json:"sender_email"`
	SenderAvatar   string    `json:"sender_avatar"`
	RecipientEmail string    `json:"recipient_email"`
	Message        string    `json:"message"`
	IsRead         bool      `json:"is_read"`
	Status         string    `json:"status"`
	IsArchive      bool      `json:"is_archived"`
	Timestamp      time.Time `json:"timestamp"`
}
