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

func GetAwardByID(id uint) (entity.Award, error) {
	var a entity.Award
	err := config.DB.First(&a, id).Error
	return a, err
}

func UpdateAward(a *entity.Award) error {
	return config.DB.Save(a).Error
}

func DeleteAward(id uint) error {
	return config.DB.Delete(&entity.Award{}, id).Error
}

func ListAwardByTeacher(teacher string) ([]entity.Award, error) {
	var list []entity.Award
	err := config.DB.Where("teacher = ?", teacher).Find(&list).Error
	return list, err
}

func ListAwardByTitle(title string) ([]entity.Award, error) {
	var list []entity.Award
	err := config.DB.Where("title = ?", title).Find(&list).Error
	return list, err
}
