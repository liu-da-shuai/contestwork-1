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

func CreateContest(c *entity.Contest) error {
	return config.DB.Create(c).Error
}

func UpdateContest(c *entity.Contest) error {
	return config.DB.Save(c).Error
}

func DeleteContest(id uint) error {
	return config.DB.Delete(&entity.Contest{}, id).Error
}

func ListContestByStatus(status string) ([]entity.Contest, error) {
	var list []entity.Contest
	err := config.DB.Where("status = ?", status).Find(&list).Error
	return list, err
}

func SearchContest(keyword string) ([]entity.Contest, error) {
	var list []entity.Contest
	err := config.DB.Where("title LIKE ?", "%"+keyword+"%").Find(&list).Error
	return list, err
}
