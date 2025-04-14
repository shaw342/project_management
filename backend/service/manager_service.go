package service

import (
	"database/sql"
)

type ManagerService struct {
	db *sql.DB
}

func newManagerService(db *sql.DB) *ManagerService {
	return &ManagerService{db: db}
}
