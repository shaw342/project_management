package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/shaw342/projet_argile/backend/model"
	"github.com/shaw342/projet_argile/backend/routes"
	"github.com/stretchr/testify/assert"
)



func TestRegister(t *testing.T){
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	value := os.Getenv("FAUNA_SECRET")
	os.Setenv("FAUNA_SECRET", value)
	router := routes.SetupRouter()

	user := model.User{
		FirstName: "shawan",
		LastName: "yousull",
		Password: "123456",
		Email: "local@gmail.com",
	}

	fmt.Print(user)

	jsonData,err := json.Marshal(&user)

	if err != nil{
		t.Fatalf("error to encoding in json format")
	}	

	req,err := http.NewRequest("POST","http://localhost/api/v1/register",bytes.NewBuffer(jsonData))

	if err != nil{
		t.Fatalf("error send request json data")
	}

	req.Header.Set("Content-Type","application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w,req)

	assert.Equal(t,http.StatusCreated,w.Code)
}


