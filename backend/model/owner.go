package model

type Owner struct {
	OwnerId   string `json:"owner_id"`
	UserId    string `json:"user_id"`
	ManagerId string `json:"manager_id"`
}
