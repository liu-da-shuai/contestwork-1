package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func CreateAward(a *entity.Award) error {
	return config.DB.Create(a).Error
}

func ListAward() ([]entity.Award, error) {
	var list []entity.Award
	err := config.DB.Find(&list).Error
	return list, err
}
