package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func ConnectDB() *sql.DB {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	db_name := os.Getenv("DB_NAME")

	constr := fmt.Sprintf(`host=%s post=%s user=%s dbname=%s password=%s sslmode=disable`, host, user, password, port, db_name)

	db, err := sql.Open("postgres", constr)

	if err != nil {
		log.Fatal(err)
	}

	return db
}
