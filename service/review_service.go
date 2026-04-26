package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
)

func CreateReview(r *entity.Review) error {
	return dao.CreateReview(r)
}

func ListReview() ([]entity.Review, error) {
	return dao.ListReview()
}
