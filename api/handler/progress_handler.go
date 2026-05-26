package handler

import (
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

	"github.com/gin-gonic/gin"
)

func GetReviewProgress(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	if contestTitle == "" {
		resp.Fail(c, "竞赛名称不能为空")
		return
	}

	signups, err := service.ListSignUpByContest(contestTitle)
	if err != nil {
		resp.Fail(c, "获取报名列表失败")
		return
	}

	reviews, err := service.ListReviewByContest(contestTitle)
	if err != nil {
		resp.Fail(c, "获取评审列表失败")
		return
	}

	reviewedTeacherNames := make(map[string]bool)
	for _, r := range reviews {
		reviewedTeacherNames[r.TeacherName] = true
	}

	pendingSignups := []gin.H{}
	reviewedSignups := []gin.H{}

	for _, s := range signups {
		if reviewedTeacherNames[s.TeacherName] {
			reviewedSignups = append(reviewedSignups, gin.H{
				"id":          s.ID,
				"teacherName": s.TeacherName,
				"courseName":  s.CourseName,
				"unit":        s.Unit,
				"status":      "已评审",
				"signupTime":  s.Time,
			})
		} else {
			pendingSignups = append(pendingSignups, gin.H{
				"id":          s.ID,
				"teacherName": s.TeacherName,
				"courseName":  s.CourseName,
				"unit":        s.Unit,
				"status":      "待评审",
				"signupTime":  s.Time,
			})
		}
	}

	total := len(signups)
	reviewed := len(reviewedSignups)
	pending := len(pendingSignups)

	progress := 0
	if total > 0 {
		progress = (reviewed * 100) / total
	}

	resp.OK(c, gin.H{
		"contestTitle": contestTitle,
		"total":        total,
		"reviewed":     reviewed,
		"pending":      pending,
		"progress":     progress,
		"reviewedList": reviewedSignups,
		"pendingList":  pendingSignups,
	})
}

func GetContestReviewProgress(c *gin.Context) {
	contests, err := service.ListContest()
	if err != nil {
		resp.Fail(c, "获取竞赛列表失败")
		return
	}

	progressList := []gin.H{}

	for _, contest := range contests {
		signups, _ := service.ListSignUpByContest(contest.Title)
		reviews, _ := service.ListReviewByContest(contest.Title)

		total := len(signups)
		reviewed := len(reviews)
		progress := 0

		if total > 0 {
			progress = (reviewed * 100) / total
		}

		progressList = append(progressList, gin.H{
			"id":            contest.ID,
			"title":         contest.Title,
			"status":        contest.Status,
			"totalSignups":  total,
			"reviewedCount": reviewed,
			"pendingCount":  total - reviewed,
			"progress":      progress,
		})
	}

	resp.OK(c, progressList)
}

func GetTeacherReviewProgress(c *gin.Context) {
	teacherName := c.Query("teacher_name")
	if teacherName == "" {
		resp.Fail(c, "教师姓名不能为空")
		return
	}

	signups, err := service.ListSignUpByTeacher(teacherName)
	if err != nil {
		resp.Fail(c, "获取报名列表失败")
		return
	}

	reviews, err := service.ListReviewByTeacher(teacherName)
	if err != nil {
		resp.Fail(c, "获取评审列表失败")
		return
	}

	reviewMap := make(map[string]int)
	for _, r := range reviews {
		key := r.ContestTitle + "_" + r.CourseName
		reviewMap[key] = r.Score
	}

	result := []gin.H{}
	reviewedCount := 0

	for _, s := range signups {
		key := s.ContestTitle + "_" + s.CourseName
		score, reviewed := reviewMap[key]

		status := "待评审"
		if reviewed {
			status = "已评审"
			reviewedCount++
		}

		result = append(result, gin.H{
			"id":           s.ID,
			"contestTitle": s.ContestTitle,
			"courseName":   s.CourseName,
			"grade":        s.Grade,
			"status":       status,
			"score":        score,
			"signupTime":   s.Time,
		})
	}

	progress := 0
	if len(signups) > 0 {
		progress = (reviewedCount * 100) / len(signups)
	}

	resp.OK(c, gin.H{
		"teacherName":   teacherName,
		"totalSignups":  len(signups),
		"reviewedCount": reviewedCount,
		"pendingCount":  len(signups) - reviewedCount,
		"progress":      progress,
		"details":       result,
	})
}
