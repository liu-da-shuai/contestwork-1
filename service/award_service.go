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
