package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func CreateBlindReview(br *entity.BlindReview) error {
	return config.DB.Create(br).Error
}

func ListBlindReviewsByReviewer(reviewerID uint) ([]entity.BlindReview, error) {
	var list []entity.BlindReview
	err := config.DB.Where("reviewer_id = ?", reviewerID).Find(&list).Error
	return list, err
}

func ListBlindReviewsByContest(contestTitle string) ([]entity.BlindReview, error) {
	var list []entity.BlindReview
	err := config.DB.Where("contest_title = ?", contestTitle).Find(&list).Error
	return list, err
}

func GetBlindReviewByID(id uint) (entity.BlindReview, error) {
	var br entity.BlindReview
	err := config.DB.Find(&br, id).Error
	return br, err
}

func UpdateBlindReview(br *entity.BlindReview) error {
	return config.DB.Save(br).Error
}

func DeleteBlindReview(id uint) error {
	return config.DB.Delete(&entity.BlindReview{}, id).Error
}

func BatchCreateBlindReviews(brs []entity.BlindReview) error {
	return config.DB.Create(&brs).Error
}

func GetBlindReviewBySignupAndReviewer(signupID, reviewerID uint) (entity.BlindReview, error) {
	var br entity.BlindReview
	err := config.DB.Where("signup_id = ? AND reviewer_id = ?", signupID, reviewerID).Find(&br).Error
	return br, err
}
