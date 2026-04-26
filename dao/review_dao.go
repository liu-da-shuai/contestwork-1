package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func CreateReview(r *entity.Review) error {
	return config.DB.Create(r).Error
}

func ListReview() ([]entity.Review, error) {
	var list []entity.Review
	err := config.DB.Find(&list).Error
	return list, err
}
