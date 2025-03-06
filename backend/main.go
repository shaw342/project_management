package main

import "github.com/shaw342/projet_argile/backend/routes"


func main() {

	router := routes.SetupRouter()
	
	router.Run()
}
