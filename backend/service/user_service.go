package service

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/shaw342/projet_argile/backend/model"
	utils_s "github.com/shaw342/projet_argile/backend/utils"
)

type UserService struct {
	db *sql.DB
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

	createAt := time.Now()

	QueryErr := s.db.QueryRow(`INSERT INTO users(firstName,lastName,email,password,status,createat)
		VALUES ($1,$2,$3,$4,$5,$6) RETURNING user_id`, user.FirstName, user.LastName, user.Email, hashPassword, user.Status, createAt).Scan(&userId)

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
	var password string

	queryString := "SELECT password FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&password)

	if err != nil {
		return "", err
	}

	return password, nil
}

func (s *UserService) GetTeam(name string) (model.Team, error) {
	var result model.Team

	queryString := "SELECT * FROM team WHERE name = $1"

	err := s.db.QueryRow(queryString, name).Scan(&result.Id, &result.TeamId, &result.Name, &result.ManagerId)

	if err != nil {
		return model.Team{}, err
	}

	return result, nil
}



func (s *UserService) GetUser(email string) (model.User, error) {
	var user model.User

	queryString := "SELECT * FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&user.UserId, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Status, &user.CreateAt)

	if err != nil {

		return model.User{}, err
	}

	return user, nil
}

func (s *UserService) Welcome(email string) (model.User, error) {
	var user model.User

	queryString := "SELECT * FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&user.UserId, &user.FirstName, &user.LastName, &user.Email)

	if err != nil {
		return model.User{}, err
	}

	return user, err
}

func (s *UserService) CreateNote(note model.Note) (model.Note, error) {
	var result model.Note

	queryString := "INSERT INTO note(id,name,content,user_id,task_id) VALUES($1,$2,$3,$4,$5)"

	err := s.db.QueryRow(queryString, &note.Id, &note.Name, &note.Content, &note.UserId, &note.NoteId).Scan(&result.Id, &result.Name, &result.Content, &result.NoteId, &result.UserId, &result.Level)

	if err != nil {
		return model.Note{}, err
	}

	return result, nil
}

func (s *UserService) CreateOwner(owner model.Owner) (model.Owner, error) {
	var serverResult model.Owner

	queryString := "INSERT INTO owner(user_id,manager_id) VALUES($1,$2) RETURNING user_id"

	err := s.db.QueryRow(queryString, &owner.UserId, &owner.ManagerId).Scan(&serverResult.OwnerId, &serverResult.UserId, &serverResult.ManagerId)

	if err != nil {
		return model.Owner{}, err
	}

	return serverResult, nil
}

func (s *UserService) SaveMailCode(code model.CodeForMail) (string, error) {
	var serverResult model.CodeForMail

	queryString := "INSERT INTO mail_code(email,code) VALUES($1,$2) RETURNING id"

	err := s.db.QueryRow(queryString, code.Email, code.Code).Scan(&serverResult.Id)

	if err != nil {
		return "", err
	}
	
	
	return serverResult.Id, nil
}

func (s *UserService) GetMailCode(id string) (model.CodeForMail, error) {
	var serverResult model.CodeForMail

	queryString := "SELECT * FROM mail_code WHERE id = $1"
	err := s.db.QueryRow(queryString, id).Scan(&serverResult.Id, &serverResult.Email, &serverResult.Code)

	if err != nil {
		return model.CodeForMail{}, fmt.Errorf("error to execute query %v", err)
	}

	return serverResult, nil
}

func (s *UserService) DeleteMailCode(id string) (bool, error) {

	queryString := "DELETE FROM mail_code WHERE id = $1"

	row, err := s.db.Exec(queryString, id)

	if err != nil {
		return false, err
	}

	rowAffected, err := row.RowsAffected()

	if err != nil {
		return false, err
	}

	return rowAffected > 0, nil
}

func (s *UserService) GetInvitation(email string) ([]model.Invitation, error) {
	var result []model.Invitation

	queryString := "SELECT id,team_id,team_name,message,is_read,recipient_email,sender_name,sender_email,is_archived,role,timestamp,status,sender_avatar FROM invitations WHERE recipient_email = $1"

	row, err := s.db.Query(queryString, &email)

	if err != nil {
		return []model.Invitation{}, err
	}

	for row.Next() {
		var invite model.Invitation

		if err := row.Scan(&invite.Id, &invite.TeamId, &invite.TeamName, &invite.Message, &invite.IsRead, &invite.RecipientEmail, &invite.SenderName, &invite.SenderEmail, &invite.IsArchive,&invite.Role,&invite.Timestamp,&invite.Status,&invite.SenderAvatar); err != nil {
			return []model.Invitation{}, err
		}

		result = append(result, invite)
	}

	return result, nil
}

func (s *UserService) IsRead(id uuid.UUID) (bool, error) {

	queryString := "UPDATE invitations SET is_read = true WHERE id = $1"

	row, err := s.db.Exec(queryString, &id)

	if err != nil {
		return false, err
	}

	rowAffect, err := row.RowsAffected()

	if err != nil {
		return false, err
	}

	if rowAffect == 0 {

		return false, fmt.Errorf("error to update")
	}

	return true, nil
}

func (s *UserService) DeclinedInvitation(id uuid.UUID) error {

	queryString := "UPDATE invitations SET status = $1, is_archived = $2 WHERE id = $3"
	result, err := s.db.Exec(queryString, "declined", true, &id)
	if err != nil {
		return fmt.Errorf("failed to decline invitation: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no invitation found with id %s", id)
	}

	return nil
}

func (s *UserService) AcceptInvitation(id uuid.UUID) error {

	queryString := "UPDATE invitations SET status = $1, is_archived = $2 WHERE id = $3"
	result, err := s.db.Exec(queryString, "accepted", true, &id)

	if err != nil {
		return fmt.Errorf("failed to decline invitation: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no invitation found with id %s", id)
	}

	return nil

}

func (s *UserService) CreateStaff(staff model.Staff) (model.Staff, error) {

	var result model.Staff

	queryString := "INSERT INTO staff(user_id,team_id,role,firstname,lastname,email) VALUES($1,$2,$3,$4,$5,$6) RETURNING staff_id"

	err := s.db.QueryRow(queryString, &staff.User_id, &staff.Team_id,&staff.Role,&staff.FirstName,&staff.LastName,&staff.Email).Scan(&result.Staff_id)

	if err != nil {

		return model.Staff{}, err
	}

	return result, nil
}

func (s *UserService) UpdateEmail(id string, code int) (bool, error) {

	queryString := "UPDATE mail_code SET code = $1 WHERE id = $2"

	result, err := s.db.Exec(queryString, id, code)

	if err != nil {
		return false, fmt.Errorf("query error: %v",err)
	}

	rowAff, err := result.RowsAffected()

	if err != nil {
		return false, fmt.Errorf("rowAffected error: %v",err)
	}

	return rowAff == 1, nil
}


func (s *UserService) AssignRole(userId uuid.UUID,roleId int) (bool,error) {

	
	queryString := "INSERT INTO user_role(user_id,role_id) VALUES ($1,$2) RETURNING user_id"

	result,err := s.db.Exec(queryString,&userId,&roleId)

	if err != nil {
		return false,fmt.Errorf("query error %v",err)
	}

	rowAff,err := result.RowsAffected()

	if err != nil{
		log.Fatal(err)
	}

	return rowAff > 0 ,nil
}

func (s *UserService) HasAcess(userEmail string ,accesName string) bool {
	var count int


	queryString := `SELECT COUNT(*)
	FROM users u
	JOIN user_role ur ON u.user_id = ur.user_id
	JOIN role_access ra ON ur.role_id = ra.role_id
	JOIN acesss a ON ra.role_id = a.role_id
	WHERE u.email = $1 AND a.access_name = $2
	`

	err := s.db.QueryRow(queryString,&userEmail,&accesName).Scan(&count)

	if err != nil{
		return false
	}

	return  count > 0
}