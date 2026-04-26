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
