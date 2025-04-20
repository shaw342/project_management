package model

type Manager struct {
	ManagerId string `json:"manager_id"`
	UserId    string `json:"user_id"`
	OwnerId   string `json:"owner_id"`
}
