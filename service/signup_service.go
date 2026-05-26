package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
)

func CreateSignUp(s *entity.SignUp) error {
	return dao.CreateSignUp(s)
}

func ListSignUp() ([]entity.SignUp, error) {
	return dao.ListSignUp()
}

func GetSignUpByID(id uint) (entity.SignUp, error) {
	return dao.GetSignUpByID(id)
}

func UpdateSignUp(s *entity.SignUp) error {
	return dao.UpdateSignUp(s)
}

func DeleteSignUp(id uint) error {
	return dao.DeleteSignUp(id)
}

func ListSignUpByContest(contestTitle string) ([]entity.SignUp, error) {
	return dao.ListSignUpByContest(contestTitle)
}

func ListSignUpByTeacher(teacherName string) ([]entity.SignUp, error) {
	return dao.ListSignUpByTeacher(teacherName)
}
