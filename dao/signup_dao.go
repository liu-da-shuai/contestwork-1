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

func GetSignUpByID(id uint) (entity.SignUp, error) {
	var s entity.SignUp
	err := config.DB.First(&s, id).Error
	return s, err
}

func UpdateSignUp(s *entity.SignUp) error {
	return config.DB.Save(s).Error
}

func DeleteSignUp(id uint) error {
	return config.DB.Delete(&entity.SignUp{}, id).Error
}

func ListSignUpByContest(contestTitle string) ([]entity.SignUp, error) {
	var list []entity.SignUp
	err := config.DB.Where("contest_title = ?", contestTitle).Find(&list).Error
	return list, err
}

func ListSignUpByTeacher(teacherName string) ([]entity.SignUp, error) {
	var list []entity.SignUp
	err := config.DB.Where("teacher_name = ?", teacherName).Find(&list).Error
	return list, err
}
