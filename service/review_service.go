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

func GetReviewByID(id uint) (entity.Review, error) {
	return dao.GetReviewByID(id)
}

func UpdateReview(r *entity.Review) error {
	return dao.UpdateReview(r)
}

func DeleteReview(id uint) error {
	return dao.DeleteReview(id)
}

func ListReviewByContest(contestTitle string) ([]entity.Review, error) {
	return dao.ListReviewByContest(contestTitle)
}

func ListReviewByTeacher(teacherName string) ([]entity.Review, error) {
	return dao.ListReviewByTeacher(teacherName)
}
