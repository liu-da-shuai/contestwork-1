package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
)

func Login(username, pwd, role string) (entity.User, bool) {
	u, err := dao.GetUserByUsernameAndRole(username, role)
	if err != nil || u.Password != pwd {
		return u, false
	}
	return u, true
}

func Register(username, pwd, role, name string) bool {
	u, _ := dao.GetUserByUsernameAndRole(username, role)
	if u.ID > 0 {
		return false
	}
	_ = dao.CreateUser(&entity.User{
		Username: username,
		Password: pwd,
		Role:     role,
		Name:     name,
	})
	return true
}

func ListUser() ([]entity.User, error) {
	return dao.ListUser()
}
