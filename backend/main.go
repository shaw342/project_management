package main

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate"
	"github.com/joho/godotenv"
	"github.com/shaw342/projet_argile/backend/routes"
)

func main() {

	router := routes.SetupRouter()

	runMigration()

	router.Run()
}

func runMigration() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(err)
	}

	user := os.Getenv("DB_USER")
	host := os.Getenv("DB_HOST")
	password := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	constr := fmt.Sprintf("posgres://%s:%s@%s:%s/%s?sslmode=disable", user, password, host, port, dbName)

	m, err := migrate.New("./migration", constr)

	if err != nil {
		log.Fatal(err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}
}
