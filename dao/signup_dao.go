package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func CreateSignUp(s *entity.SignUp) error {
	return config.DB.Create(s).Error
}

func ListSignUp() ([]entity.SignUp, error) {
	var list []entity.SignUp
	err := config.DB.Find(&list).Error
	return list, err
}
