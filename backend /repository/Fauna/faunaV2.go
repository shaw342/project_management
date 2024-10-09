package repository

import (
	"github.com/fauna/fauna-go"
	"github.com/shaw342/projet_argile/backend/model"
)

type FaunaUserRepository struct {
    client *fauna.Client
}

func NewFaunaUserRepository(client *fauna.Client) *FaunaUserRepository {
    return &FaunaUserRepository{client: client}
}

func (r *FaunaUserRepository) CreateUser(user model.User) (model.User, error) {
    createUser, err := fauna.FQL(`User.create(${data})`, map[string]any{"data": user})
    if err != nil {
        return model.User{}, err
    }

    res, err := r.client.Query(createUser)
    if err != nil {
        return model.User{}, err
    }

    var createdUser model.User
    if err := res.Unmarshal(&createdUser); err != nil {
        return model.User{}, err
    }

    return createdUser, nil
}
