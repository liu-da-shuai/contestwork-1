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

func GetUserByID(id uint) (entity.User, error) {
	var u entity.User
	err := config.DB.First(&u, id).Error
	return u, err
}

func UpdateUser(u *entity.User) error {
	return config.DB.Save(u).Error
}

func DeleteUser(id uint) error {
	return config.DB.Delete(&entity.User{}, id).Error
}

func UpdatePassword(id uint, newPassword string) error {
	return config.DB.Model(&entity.User{}).Where("id = ?", id).Update("password", newPassword).Error
}

func ListUserByRole(role string) ([]entity.User, error) {
	var list []entity.User
	err := config.DB.Where("role = ?", role).Find(&list).Error
	return list, err
}
