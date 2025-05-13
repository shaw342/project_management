package service

import (
	"database/sql"
	"errors"
	"log"

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

func (s *ManagerService) GetManagerByEmail(email string) (model.Manager, error) {
	var result model.Manager

	queryString := `SELECT m.manager_id,m.user_id FROM user u JOIN manager m ON u.user_id = m.user_id JOIN project p ON m.manager_id = p.manager_id WHERE u.user_id = 1$`

	err := s.db.QueryRow(queryString, &email).Scan(&result.ManagerId, &result.ManagerId)

	if err != nil {
		return model.Manager{}, err
	}

	return result, nil
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
	var result []model.Team

	queryString := `
		SELECT t.id, t.team_id, t.name, t.manager_id
		FROM users u
		JOIN manager m ON u.user_id = m.user_id
		JOIN team t ON m.manager_id = t.manager_id
		WHERE u.user_id = $1`

	rows, err := s.db.Query(queryString, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var team model.Team
		if err := rows.Scan(&team.Id, &team.TeamId, &team.Name, &team.ManagerId); err != nil {
			return nil, err
		}
		result = append(result, team)
	}

	if err := rows.Err(); err != nil {
		return nil, err
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

func (s *ManagerService) GetAllInvitationStatus(email string) ([]model.Invitation, error) {
	var result []model.Invitation

	queryString := "SELECT id,team_id,team_name,message,is_read,recipient_email,sender_email,sender_name,is_archived,status,timestamp FROM invitations WHERE sender_email = $1"

	row, err := s.db.Query(queryString, &email)

	if err != nil {
		return []model.Invitation{}, err
	}

	for row.Next() {
		var invite model.Invitation

		if err := row.Scan(&invite.Id, &invite.TeamId, &invite.TeamName, &invite.Message, &invite.IsRead, &invite.RecipientEmail, &invite.SenderEmail, &invite.SenderName, &invite.IsArchive, &invite.Status, &invite.Timestamp); err != nil {
			return []model.Invitation{}, err
		}

		result = append(result, invite)

	}

	return result, nil
}

func (s *ManagerService) GetAllStaff(team_id uuid.UUID) ([]model.User, error) {
	var result []model.User

	querystring := "SELECT u.firstname, u.lastname, u.email FROM staff s JOIN user u ON s.user_id = u.user_id WHERE s.team_id = $1"

	row, err := s.db.Query(querystring, &team_id)

	if err != nil {
		return []model.User{}, err
	}

	for row.Next() {
		var user model.User

		if err := row.Scan(&user.FirstName, &user.LastName, &user.Email); err != nil {
			return []model.User{}, err
		}

		result = append(result, user)
	}

	return result, nil
}

func (s *ManagerService) CreateProject(project model.Project) (model.Project, error) {
	var result model.Project

	teamId, er := uuid.Parse(project.TeamId)

	if er != nil {
		log.Fatal(er)
	}
	queryString := `
        INSERT INTO project (name, description, manager_id, team_id, startdate, enddate, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING project_id, name, description, manager_id, team_id, startdate, enddate, status
    `

	err := s.db.QueryRow(queryString,
		&project.Name, &project.Description,
		&project.ManagerId, &teamId,
		&project.StartDate, &project.EndDate, &project.Status).Scan(&result.ProjectId, &result.Name, &result.Description, &result.ManagerId, &result.TeamId, &result.StartDate, &result.EndDate, &result.Status)

	if err != nil {
		return model.Project{}, err
	}

	return result, nil
}

func (s *ManagerService) GetTeamByTeamId(teamId uuid.UUID) (model.Team, error) {
	var result model.Team

	if teamId == uuid.Nil {
		return model.Team{}, errors.New("teamId cannot be empty")
	}

	queryString := "SELECT team_id, manager_id,name FROM team WHERE team_id = $1"

	err := s.db.QueryRow(queryString, teamId).Scan(&result.TeamId, &result.ManagerId, &result.Name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return model.Team{}, errors.New("no team found for the given teamId")
		}
		return model.Team{}, err
	}

	return result, nil
}

func (s *ManagerService) GetUserNameByManagerId(manager_id uuid.UUID) (model.User, error) {
	var result model.User

	queryString := `
        SELECT u.firstname,u.lastname
        FROM users u
        JOIN manager m ON u.user_id = m.user_id
        WHERE m.manager_id = $1`

	err := s.db.QueryRow(queryString, &manager_id).Scan(&result.FirstName, &result.LastName)

	if err != nil {
		return model.User{}, err
	}

	return result, nil
}

func (s *ManagerService) GetAllProject(manager_id uuid.UUID) ([]model.Project, error) {
	var result []model.Project

	queryString := "SELECT * FROM project WHERE manager_id = $1"

	row, err := s.db.Query(queryString, &manager_id)

	if err != nil {
		return []model.Project{}, err
	}

	for row.Next() {
		var project model.Project

		if err := row.Scan(&project.ProjectId, &project.Name, &project.Description, &project.ManagerId, &project.TeamId, &project.StartDate, &project.EndDate, &project.Status); err != nil {
			return []model.Project{}, err
		}

		result = append(result, project)
	}

	return result, nil
}
