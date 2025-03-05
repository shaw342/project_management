package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/stretchr/testify/assert"
)


func SetupRouter() *gin.Engine{
	r := gin.Default()
	return r
}

func RegisterTest(t *testing.T){
	router := SetupRouter()

	user := model.User{

		UserId: uuid.New().String(),
		FirstName: "shawan",
		LastName: "yousull",
		Email: "local@gmail.com",
	}

	jsonData,err := json.Marshal(&user)

	if err != nil{
		t.Fatalf("error to encoding in json format")
	}	

	req,err := http.NewRequest("POST","http://localhost:8080/api/v1/register",bytes.NewBuffer(jsonData))

	if err != nil{
		t.Fatalf("error send request json data")
	}

	req.Header.Set("Content-Type","application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w,req)

	assert.Equal(t,w.Code,http.StatusCreated)
} 