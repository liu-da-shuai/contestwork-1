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

func GetReviewByID(id uint) (entity.Review, error) {
	var r entity.Review
	err := config.DB.First(&r, id).Error
	return r, err
}

func UpdateReview(r *entity.Review) error {
	return config.DB.Save(r).Error
}

func DeleteReview(id uint) error {
	return config.DB.Delete(&entity.Review{}, id).Error
}

func ListReviewByContest(contestTitle string) ([]entity.Review, error) {
	var list []entity.Review
	err := config.DB.Where("contest_title = ?", contestTitle).Find(&list).Error
	return list, err
}

func ListReviewByTeacher(teacherName string) ([]entity.Review, error) {
	var list []entity.Review
	err := config.DB.Where("teacher_name = ?", teacherName).Find(&list).Error
	return list, err
}
