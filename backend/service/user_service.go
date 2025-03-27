package service

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/shaw342/projet_argile/backend/model"
)

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(user model.User) (model.User, error) {

	var userId []uint8

	err := s.db.QueryRow(`INSERT INTO users(firstName,lastName,email,password,status,createat)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id`, user.FirstName, user.LastName, user.Email, user.Password, user.Status, user.CreateAt).Scan(&userId)

	if err != nil {
		return model.User{}, err
	}

	return user, nil
}
