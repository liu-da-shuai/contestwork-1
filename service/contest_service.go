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

func CreateContest(c *entity.Contest) error {
	return dao.CreateContest(c)
}

func UpdateContest(c *entity.Contest) error {
	return dao.UpdateContest(c)
}

func DeleteContest(id uint) error {
	return dao.DeleteContest(id)
}

func ListContestByStatus(status string) ([]entity.Contest, error) {
	return dao.ListContestByStatus(status)
}

func SearchContest(keyword string) ([]entity.Contest, error) {
	return dao.SearchContest(keyword)
}
