package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/shaw342/projet_argile/backend/config"
	"github.com/shaw342/projet_argile/backend/routes"
)

func main() {
	db := config.ConnectDB()
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	defer db.Close()

	router := routes.SetupRouter(db)

	go func() {
		if err := router.Run(":8080"); err != nil && err != http.ErrServerClosed {
			log.Fatal("Could not run serveur")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server")

}
