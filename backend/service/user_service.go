package service

import (
	"database/sql"

	"github.com/shaw342/projet_argile/backend/model"
)

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(user model.User) (model.User, error) {

	var userId int

	err := s.db.QueryRow(`INSERT INTO users(firstName,lastName,email,password,status)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`, user.FirstName, user.LastName, user.Email, user.Password, user.Status).Scan(&userId)

	if err != nil {
		return model.User{}, err
	}

	return user, nil
}
