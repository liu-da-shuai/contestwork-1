package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func ListContest() ([]entity.Contest, error) {
	var list []entity.Contest
	err := config.DB.Find(&list).Error
	return list, err
}

func GetContestByID(id uint) (entity.Contest, error) {
	var c entity.Contest
	err := config.DB.Find(&c, id).Error
	return c, err
}
