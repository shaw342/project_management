package service

import (
	"database/sql"

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

func (s *ManagerService) CreateTeam(team model.Team) (string, error) {
	var result model.Team

	queryString := "INSERT INTO team(id,name,owner_id) VALUES($1,$2,$3) RETURNING team_id"

	queryErro := s.db.QueryRow(queryString, team.Id, team.Name, team.OwnerId).Scan(&result.TeamId)

	if queryErro != nil {
		return "", queryErro
	}

	return result.TeamId, nil
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
