package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func GetUserByUsernameAndRole(username, role string) (entity.User, error) {
	var u entity.User
	err := config.DB.Where("username = ? AND role = ?", username, role).First(&u).Error
	return u, err
}

func CreateUser(u *entity.User) error {
	return config.DB.Create(u).Error
}

func ListUser() ([]entity.User, error) {
	var list []entity.User
	err := config.DB.Find(&list).Error
	return list, err
}
