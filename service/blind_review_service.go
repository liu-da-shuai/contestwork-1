package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
	"math/rand"
	"time"
)

func CreateBlindReview(br *entity.BlindReview) error {
	return dao.CreateBlindReview(br)
}

func ListBlindReviewsByReviewer(reviewerID uint) ([]entity.BlindReview, error) {
	return dao.ListBlindReviewsByReviewer(reviewerID)
}

func ListBlindReviewsByContest(contestTitle string) ([]entity.BlindReview, error) {
	return dao.ListBlindReviewsByContest(contestTitle)
}

func GetBlindReviewByID(id uint) (entity.BlindReview, error) {
	return dao.GetBlindReviewByID(id)
}

func UpdateBlindReview(br *entity.BlindReview) error {
	return dao.UpdateBlindReview(br)
}

func DeleteBlindReview(id uint) error {
	return dao.DeleteBlindReview(id)
}

func AssignBlindReviews(contestTitle string, reviewerIDs []uint) error {
	signups, err := ListSignUpByContest(contestTitle)
	if err != nil {
		return err
	}

	if len(signups) == 0 || len(reviewerIDs) == 0 {
		return nil
	}

	reviewers, err := ListUser()
	if err != nil {
		return err
	}

	reviewerMap := make(map[uint]string)
	for _, u := range reviewers {
		reviewerMap[u.ID] = u.Name
	}

	rand.Seed(time.Now().UnixNano())
	shuffledSignups := make([]entity.SignUp, len(signups))
	copy(shuffledSignups, signups)
	rand.Shuffle(len(shuffledSignups), func(i, j int) {
		shuffledSignups[i], shuffledSignups[j] = shuffledSignups[j], shuffledSignups[i]
	})

	var blindReviews []entity.BlindReview
	reviewerCount := len(reviewerIDs)

	for i, signup := range shuffledSignups {
		reviewerID := reviewerIDs[i%reviewerCount]
		reviewerName := reviewerMap[reviewerID]

		br := entity.BlindReview{
			ContestTitle: contestTitle,
			SignupID:     signup.ID,
			ReviewerID:   reviewerID,
			ReviewerName: reviewerName,
			AssignedAt:   time.Now(),
			Reviewed:     false,
			Score:        0,
			Comment:      "",
		}

		blindReviews = append(blindReviews, br)
	}

	return dao.BatchCreateBlindReviews(blindReviews)
}

func SubmitBlindReview(id uint, score int, comment string) error {
	br, err := dao.GetBlindReviewByID(id)
	if err != nil {
		return err
	}

	now := time.Now()
	br.Reviewed = true
	br.Score = score
	br.Comment = comment
	br.ReviewedAt = &now

	return dao.UpdateBlindReview(&br)
}

func GetBlindReviewForReviewer(reviewerID uint, contestTitle string) ([]entity.BlindReview, error) {
	brs, err := dao.ListBlindReviewsByReviewer(reviewerID)
	if err != nil {
		return nil, err
	}

	var filtered []entity.BlindReview
	for _, br := range brs {
		if br.ContestTitle == contestTitle {
			filtered = append(filtered, br)
		}
	}

	return filtered, nil
}
