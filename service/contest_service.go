package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
)

func ListContest() ([]entity.Contest, error) {
	return dao.ListContest()
}
func GetContestByID(id uint) (entity.Contest, error) {
	return dao.GetContestByID(id)
}
