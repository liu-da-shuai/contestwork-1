package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
)

func CreateAward(a *entity.Award) error {
	return dao.CreateAward(a)
}

func ListAward() ([]entity.Award, error) {
	return dao.ListAward()
}

func GetAwardByID(id uint) (entity.Award, error) {
	return dao.GetAwardByID(id)
}

func UpdateAward(a *entity.Award) error {
	return dao.UpdateAward(a)
}

func DeleteAward(id uint) error {
	return dao.DeleteAward(id)
}

func ListAwardByTeacher(teacher string) ([]entity.Award, error) {
	return dao.ListAwardByTeacher(teacher)
}

func ListAwardByTitle(title string) ([]entity.Award, error) {
	return dao.ListAwardByTitle(title)
}
