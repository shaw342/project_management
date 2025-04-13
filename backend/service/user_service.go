package service

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/shaw342/projet_argile/backend/model"
	utils_s "github.com/shaw342/projet_argile/backend/utils"
)

type UserService struct {
	db *sql.DB
}

type ServiceInterface struct {
	CreateUser (model.User)
	CheckUser  (model.User)
	GetUser    (model.User)
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(user model.User) (model.User, error) {

	var userId []uint8

	hashPassword, err := utils_s.HashPassword(user.Password)

	if err != nil {
		return model.User{}, err
	}

	QueryErr := s.db.QueryRow(`INSERT INTO users(firstName,lastName,email,password,status,createat)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id`, user.FirstName, user.LastName, user.Email, hashPassword, user.Status, user.CreateAt).Scan(&userId)

	if QueryErr != nil {
		return model.User{}, QueryErr
	}

	return user, nil
}

func (s *UserService) CheckUser(email string) (bool, error) {

	var result bool

	queryString := "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);"

	err := s.db.QueryRow(queryString, email).Scan(&result)

	if err != nil {
		return false, err
	}

	return result, nil
}

func (s *UserService) GetAllUser() ([]model.User, error) {
	var result []model.User

	queryString := "SELECT * FROM users"

	row, err := s.db.Query(queryString)

	if err != nil {
		return []model.User{}, err
	}

	for row.Next() {
		var user model.User
		if err := row.Scan(&user.UserId, &user.Email, &user.FirstName, &user.LastName); err != nil {
			return []model.User{}, err
		}
		result = append(result, user)
	}

	return result, nil
}

func (s *UserService) GetAuth(email string) (string, error) {
	var auth model.Auth

	queryString := "SELECT password FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&auth.Password)

	if err != nil {
		return "", err
	}

	return auth.Password, nil
}

func (s *UserService) GetUser(email string) (model.User, error) {
	var user model.User

	queryString := "SELECT * FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&user.FirstName, &user.LastName, &user.CreateAt, &user.Password, user.UserId, &user.Status, user.Email)

	fmt.Println(user.Password)

	if err != nil {

		return model.User{}, err
	}

	return user, nil
}
