package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"time"

	verification "github.com/shaw342/projet_argile/backend/Verification"
	"github.com/shaw342/projet_argile/backend/config"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/routes"
	"github.com/shaw342/projet_argile/backend/service"
	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
	db := config.ConnectDB()
	defer db.Close()
	router := routes.SetupRouter(db)
	createat := time.DateOnly

	user := model.User{
		FirstName: "shawan",
		LastName:  "yousull",
		Password:  "123456",
		Email:     "local@gmail.com",
		Status:    "active",
		CreateAt:  createat,
	}

	jsonData, err := json.Marshal(&user)

	if err != nil {
		t.Fatalf("error to encoding in json format")
	}

	req, err := http.NewRequest("POST", "http://localhost:8080/api/v1/register", bytes.NewBuffer(jsonData))

	if err != nil {
		t.Fatalf("error send request json data")
	}

	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestCreateTask(t *testing.T) {
	db := config.ConnectDB()
	defer db.Close()
	router := routes.SetupRouter(db)

	task := model.Task{
		TaskId:  "1",
		Name:    "implement authentication",
		Content: "decription",
		Assign:  "124",
	}

	jsonData, err := json.Marshal(&task)

	if err != nil {
		t.Error(err)
	}

	req, err := http.NewRequest("POST", "http://localhost:8080/api/task/create", bytes.NewBuffer(jsonData))

	if err != nil {
		t.Error(err)
	}

	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

}

func TestCheckUser(t *testing.T) {
	db := config.ConnectDB()
	defer db.Close()
	userService := service.NewUserService(db)

	email := "local@gmail.com"

	response, err := userService.CheckUser(email)

	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, true, response)
}

func TestEmail(t *testing.T) {

	email := "localfv9efnv"
	result, err := verification.SendEmail(email)

	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, "localfv9efnv", result)
}

func TestGetUser(t *testing.T) {
	db := config.ConnectDB()
	defer db.Close()
	router := routes.SetupRouter(db)

	user := "local@gmail.com"

	jsonData, err := json.Marshal(&user)

	if err != nil {
		t.Error(err)
	}

	w := httptest.NewRecorder()

	req, err := http.NewRequest("POST", "http:localhost:8080/api/v1/user/get", bytes.NewBuffer(jsonData))

	if err != nil {
		t.Error(err)
	}

	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusAccepted, w.Code)

}

func TestGetAllUser(t *testing.T) {
	db := config.ConnectDB()
	defer db.Close()
	router := routes.SetupRouter(db)

	req, err := http.NewRequest("GET", "http:localhost:8080/api/v1/user/get", bytes.NewBuffer(nil))

	if err != nil {
		t.Error(err)
	}
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
