package Api_v2

import (
	"github.com/shaw342/projet_argile/backend/model"
)


type UserRepository interface{
	CreateUser(user model.User) (model.User, error)
    GetUserByID(id string) (model.User, error)
}

