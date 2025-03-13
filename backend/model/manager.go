package model

type Manager struct {
	ManagerId string `json:"managerId" fauna:"managerId"`
	Name      string `json:"name" fauna:"name"`
}
