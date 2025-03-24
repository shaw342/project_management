package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/routes"
	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
	router := routes.SetupRouter()

	user := model.User{
		FirstName: "shawan",
		LastName:  "yousull",
		Password:  "123456",
		Email:     "local@gmail.com",
	}

	jsonData, err := json.Marshal(&user)

	if err != nil {
		t.Fatalf("error to encoding in json format")
	}

	req, err := http.NewRequest("POST", "http://localhost/api/v1/register", bytes.NewBuffer(jsonData))

	if err != nil {
		t.Fatalf("error send request json data")
	}

	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestCreateTask(t *testing.T) {
	router := routes.SetupRouter()

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
