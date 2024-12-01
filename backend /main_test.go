package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/shaw342/projet_argile/backend/model"
	repository "github.com/shaw342/projet_argile/backend/repository/Fauna"
	"github.com/stretchr/testify/assert"
)

func SetUpRouter() *gin.Engine{
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
    os.Setenv("FAUNA_SECRET",value)
    router := gin.New()

    router.POST("/api/v1/user", repository.CreateUser)

    user := model.User{
        FirstName: "shawan",
        LastName: "barua",
        Email:    "shawan@example.com",
        Password: "password",
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

    if createdUser.LastName != user.LastName || createdUser.Email != user.Email || createdUser.FirstName != user.FirstName{
        t.Errorf("Expected user %v, but got %v", user, createdUser)
    }

    }
}



func TestCreateTask(t *testing.T){
    err := godotenv.Load()
    if err != nil {
        panic(err)
    }

    value := os.Getenv("FAUNA_SECRET")

    os.Setenv("FAUNA_SECRET",value)

    router := gin.New()
 
    router.POST("api/v1/task",repository.CreateTask)
    w := httptest.NewRecorder()
    task := model.Task{
				Id:"23",
        Name: "faire les course",
        Content:"acheter des courgette",
        State: "IDLE",
    }

    taskJson,_ := json.Marshal(task)
    req,_ := http.NewRequest("POST","api/v1/task",bytes.NewBufferString(string(taskJson)))
    router.ServeHTTP(w,req)
    t.Error(req)
    req.Header.Set("Content-Type","application/json")

    if w.Code != http.StatusCreated {
        t.Errorf("Expected status code %d, but got %d", http.StatusCreated, w.Code)
    }

    assert.Equal(t,201,w.Code)

    if task.Name == "" || task.Content == "" || task.State == ""{
        t.Errorf("some information ar empty in task section")
    }

}

