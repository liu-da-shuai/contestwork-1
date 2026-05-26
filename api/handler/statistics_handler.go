package handler

import (
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

	"github.com/gin-gonic/gin"
)

func ContestStatistics(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	if contestTitle == "" {
		resp.Fail(c, "竞赛名称不能为空")
		return
	}

	signups, _ := service.ListSignUpByContest(contestTitle)
	reviews, _ := service.ListReviewByContest(contestTitle)
	awards, _ := service.ListAwardByTitle(contestTitle)

	var totalScore int
	for _, r := range reviews {
		totalScore += r.Score
	}
	avgScore := 0
	if len(reviews) > 0 {
		avgScore = totalScore / len(reviews)
	}

	stats := gin.H{
		"contest_title": contestTitle,
		"signup_count":  len(signups),
		"review_count":  len(reviews),
		"award_count":   len(awards),
		"average_score": avgScore,
		"total_score":   totalScore,
	}
	resp.OK(c, stats)
}

func TeacherStatistics(c *gin.Context) {
	teacherName := c.Query("teacher_name")
	if teacherName == "" {
		resp.Fail(c, "教师姓名不能为空")
		return
	}

	signups, _ := service.ListSignUpByTeacher(teacherName)
	reviews, _ := service.ListReviewByTeacher(teacherName)
	awards, _ := service.ListAwardByTeacher(teacherName)

	var totalScore int
	for _, r := range reviews {
		totalScore += r.Score
	}
	avgScore := 0
	if len(reviews) > 0 {
		avgScore = totalScore / len(reviews)
	}

	stats := gin.H{
		"teacher_name":  teacherName,
		"contest_count": len(signups),
		"review_count":  len(reviews),
		"award_count":   len(awards),
		"average_score": avgScore,
		"total_score":   totalScore,
	}
	resp.OK(c, stats)
}

func OverallStatistics(c *gin.Context) {
	contests, _ := service.ListContest()
	users, _ := service.ListUser()
	signups, _ := service.ListSignUp()
	reviews, _ := service.ListReview()
	awards, _ := service.ListAward()

	var totalScore int
	for _, r := range reviews {
		totalScore += r.Score
	}
	avgScore := 0
	if len(reviews) > 0 {
		avgScore = totalScore / len(reviews)
	}

	var ongoingCount, finishedCount int
	for _, c := range contests {
		if c.Status == "进行中" {
			ongoingCount++
		} else if c.Status == "已结束" {
			finishedCount++
		}
	}

	stats := gin.H{
		"total_contests":    len(contests),
		"ongoing_contests":  ongoingCount,
		"finished_contests": finishedCount,
		"total_users":       len(users),
		"total_signups":     len(signups),
		"total_reviews":     len(reviews),
		"total_awards":      len(awards),
		"average_score":     avgScore,
	}
	resp.OK(c, stats)
}
