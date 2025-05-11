package service

import (
	"database/sql"

	"github.com/google/uuid"
	"github.com/shaw342/projet_argile/backend/model"
)

type ManagerService struct {
	db *sql.DB
}

func NewManagerService(db *sql.DB) *ManagerService {
	return &ManagerService{db: db}
}

func (s *ManagerService) CreateTask(task model.Task) (string, error) {
	var result model.Task

	queryString := "INSERT INTO task(task_id,name,content,assign,state) VALUES($1,$2,$3,$4,$5) RETURNING task_id"

	QuerErro := s.db.QueryRow(queryString, &task.TaskId, &task.Name, &task.Content, &task.Assign, &task.State).Scan(&result.TaskId)

	if QuerErro != nil {
		return "", QuerErro
	}

	return result.TaskId, nil
}

func (s *ManagerService) GetUser(email string) (model.User, error) {
	var user model.User

	queryString := "SELECT * FROM users WHERE email = $1"

	err := s.db.QueryRow(queryString, email).Scan(&user.UserId, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.Status, &user.CreateAt)

	if err != nil {

		return model.User{}, err
	}

	return user, nil
}

func (s *ManagerService) CreateTeam(team model.Team) (model.Team, error) {
	var result model.Team

	queryString := `
        INSERT INTO team (id, name, manager_id) 
        VALUES ($1, $2, $3) 
        RETURNING id, team_id, name, manager_id
    `

	err := s.db.QueryRow(queryString, team.Id, team.Name, team.ManagerId).
		Scan(&result.Id, &result.TeamId, &result.Name, &result.ManagerId)

	if err != nil {
		return model.Team{}, err
	}

	return result, nil
}

func (s *ManagerService) DeleteTeam(teamId string) (string, error) {
	var result string

	queryString := "DELETE FROM team WHERE team.teamId = $1"

	queryErro := s.db.QueryRow(queryString, teamId).Scan(&result)

	if queryErro != nil {
		return "", queryErro
	}

	return result, nil
}

func (s *ManagerService) CreateManager(manager model.Manager) (model.Manager, error) {
	var serverResult model.Manager

	queryString := "INSERT INTO manager(user_id) VALUES($1) RETURNING user_id,manager_id"

	err := s.db.QueryRow(queryString, manager.UserId).Scan(&serverResult.UserId, &serverResult.ManagerId)

	if err != nil {
		return model.Manager{}, err
	}

	return serverResult, nil
}

func (s *ManagerService) Search(query string) ([]model.User, error) {
	result := []model.User{}

	queryStringEmail := "SELECT user_id, firstname, lastname, email FROM users WHERE email ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1 LIMIT 10"

	usersRows, err := s.db.Query(queryStringEmail, "%"+query+"%")

	if err != nil {
		return []model.User{}, err
	}

	for usersRows.Next() {
		var user model.User
		if err := usersRows.Scan(&user.UserId, &user.FirstName, &user.LastName, &user.Email); err != nil {
			return []model.User{}, err
		}
		result = append(result, user)
	}

	return result, nil
}

func (s *ManagerService) GetAllTeam(userId uuid.UUID) ([]model.Team, error) {
	result := []model.Team{}

	queryString := `
			SELECT id,team_id,name
			FROM users u
			JOIN manager m ON u.user_id = m.user_id
			JOIN team t ON m.manager_id = t.manager_id
			WHERE u.user_id = $1`

	row, err := s.db.Query(queryString, &userId)

	if err != nil {
		return []model.Team{}, err
	}

	for row.Next() {
		var team model.Team
		if err := row.Scan(&team.Id, &team.TeamId, &team.Name); err != nil {
			return []model.Team{}, err
		}

		result = append(result, team)
	}

	return result, nil
}

func (s *ManagerService) CreateInvitation(invite model.Invitation) (model.Invitation, error) {
	var result model.Invitation

	queryString := "INSERT INTO invitations(team_id,team_name,sender_name,sender_email,sender_avatar,message,recipient_email) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id"

	err := s.db.QueryRow(queryString, &invite.TeamId, &invite.TeamName, &invite.SenderName, &invite.SenderEmail, &invite.SenderAvatar, &invite.Message, &invite.RecipientEmail).Scan(&invite.Id)

	if err != nil {
		return model.Invitation{}, err
	}

	return result, err
}

func (s *ManagerService) GetTeam(name string) (model.Team, error) {
	var result model.Team

	queryString := "SELECT * FROM team WHERE name = $1"

	err := s.db.QueryRow(queryString, name).Scan(&result.Id, &result.TeamId, &result.Name, &result.ManagerId)

	if err != nil {
		return model.Team{}, err
	}

	return result, nil
}
