package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/shaw342/projet_argile/backend/model"
	repository "github.com/shaw342/projet_argile/backend/repository/Fauna"
	"github.com/stretchr/testify/assert"
)

func SetUpRouter() *gin.Engine {
	router := gin.Default()
	return router
}

func TestCreateUser(t *testing.T) {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	value := os.Getenv("FAUNA_SECRET")
	fmt.Print(value)
	os.Setenv("FAUNA_SECRET", value)
	router := gin.New()

	router.POST("/api/v1/user", repository.CreateUser)

	user := model.User{
		FirstName: "shawan",
		LastName:  "barua",
		Email:     "shawan@example.com",
		Password:  "password",
	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/api/v1/user", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status code %d, but got %d", http.StatusCreated, w.Code)
	}

	var createdUser model.User
	err = json.Unmarshal(w.Body.Bytes(), &createdUser)
	if err != nil {
		t.Fatal(err)
	}

	if createdUser.LastName != user.LastName || createdUser.Email != user.Email || createdUser.FirstName != user.FirstName {
		t.Errorf("Expected user %v, but got %v", user, createdUser)
	}

}

func TestCreateTask(t *testing.T) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	value := os.Getenv("FAUNA_SECRET")

	os.Setenv("FAUNA_SECRET", value)

	router := SetUpRouter()

	router.POST("api/v1/task", repository.CreateTask)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/v1/task", strings.NewReader(`{"id":"23","name":"faire les course","content":"acheter des courgette","state":"IDLE"}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer ")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

}

func TestDeleteTask(t *testing.T) {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	value := os.Getenv("FAUNA_SECRET")
	os.Setenv("FAUNA_SECRET", value)

	router := SetUpRouter()

	router.DELETE("api/v1/deleteTask", repository.DeleteTask)
	w := httptest.NewRecorder()

	req, _ := http.NewRequest("DELETE", "api/v1/deleteTask", strings.NewReader(`"id":"23"`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer")
	router.ServeHTTP(w, req)
}

func TestDeleteProject(t *testing.T) {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	value := os.Getenv("FAUNA_SECRET")

	os.Setenv("FAUNA_SECRET", value)

	router := SetUpRouter()

	router.DELETE("api/v1/deleteProjects", repository.DeleteProject)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("DELETE", "api/v1/deleteProjects", strings.NewReader(`{"name":"id"}`))

	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer")
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestUpdateProject(t *testing.T) {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	value := os.Getenv("FAUNA_SECRET")

	os.Setenv("FAUNA_SECRET", value)

	router := SetUpRouter()

	router.PATCH("api/v1/updateProject", repository.UpdateProject)

	w := httptest.NewRecorder()

	req, err := http.NewRequest("PATCH", "api/v1/", strings.NewReader(`{"name":"web-site"}`))

	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetProject(t *testing.T) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	value := os.Getenv("FAUNA_SECRET")

	os.Setenv("FAUNA_SECRET", value)

}
