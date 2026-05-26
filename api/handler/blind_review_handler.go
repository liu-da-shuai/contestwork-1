package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AssignBlindReviews(c *gin.Context) {
	var req struct {
		ContestTitle string `json:"contest_title"`
		ReviewerIDs  []uint `json:"reviewer_ids"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		resp.Fail(c, "参数错误")
		return
	}

	if req.ContestTitle == "" {
		resp.Fail(c, "竞赛名称不能为空")
		return
	}

	if len(req.ReviewerIDs) == 0 {
		resp.Fail(c, "请选择评审员")
		return
	}

	err := service.AssignBlindReviews(req.ContestTitle, req.ReviewerIDs)
	if err != nil {
		resp.Fail(c, "分配失败: "+err.Error())
		return
	}

	resp.OK(c, "分配成功")
}

func GetBlindReviewsForReviewer(c *gin.Context) {
	reviewerIDStr := c.Query("reviewer_id")
	reviewerID, err := strconv.Atoi(reviewerIDStr)
	if err != nil || reviewerID <= 0 {
		resp.Fail(c, "评审员ID无效")
		return
	}

	contestTitle := c.Query("contest_title")

	var reviews []entity.BlindReview
	if contestTitle != "" {
		reviews, err = service.GetBlindReviewForReviewer(uint(reviewerID), contestTitle)
	} else {
		reviews, err = service.ListBlindReviewsByReviewer(uint(reviewerID))
	}

	if err != nil {
		resp.Fail(c, "获取评审任务失败")
		return
	}

	signupMap := make(map[uint]entity.SignUp)
	for _, br := range reviews {
		if _, ok := signupMap[br.SignupID]; !ok {
			signup, _ := service.GetSignUpByID(br.SignupID)
			signupMap[br.SignupID] = signup
		}
	}

	result := []gin.H{}
	for _, br := range reviews {
		signup := signupMap[br.SignupID]
		reviewedAt := ""
		if br.ReviewedAt != nil {
			reviewedAt = br.ReviewedAt.Format("2006-01-02 15:04:05")
		}
		result = append(result, gin.H{
			"id":           br.ID,
			"contestTitle": br.ContestTitle,
			"signupID":     br.SignupID,
			"courseName":   signup.CourseName,
			"grade":        signup.Grade,
			"desc":         signup.Desc,
			"reviewed":     br.Reviewed,
			"score":        br.Score,
			"comment":      br.Comment,
			"assignedAt":   br.AssignedAt.Format("2006-01-02 15:04:05"),
			"reviewedAt":   reviewedAt,
		})
	}

	resp.OK(c, result)
}

func SubmitBlindReview(c *gin.Context) {
	var req struct {
		ID      uint   `json:"id"`
		Score   int    `json:"score"`
		Comment string `json:"comment"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		resp.Fail(c, "参数错误")
		return
	}

	if req.ID <= 0 {
		resp.Fail(c, "评审ID无效")
		return
	}

	if req.Score < 0 || req.Score > 100 {
		resp.Fail(c, "评分必须在0-100之间")
		return
	}

	err := service.SubmitBlindReview(req.ID, req.Score, req.Comment)
	if err != nil {
		resp.Fail(c, "提交失败")
		return
	}

	resp.OK(c, "提交成功")
}

func GetBlindReviewDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "评审ID无效")
		return
	}

	br, err := service.GetBlindReviewByID(uint(id))
	if err != nil {
		resp.Fail(c, "评审记录不存在")
		return
	}

	signup, err := service.GetSignUpByID(br.SignupID)
	if err != nil {
		resp.Fail(c, "获取报名信息失败")
		return
	}

	reviewedAt := ""
	if br.ReviewedAt != nil {
		reviewedAt = br.ReviewedAt.Format("2006-01-02 15:04:05")
	}

	resp.OK(c, gin.H{
		"id":           br.ID,
		"contestTitle": br.ContestTitle,
		"signupID":     br.SignupID,
		"courseName":   signup.CourseName,
		"grade":        signup.Grade,
		"desc":         signup.Desc,
		"reviewed":     br.Reviewed,
		"score":        br.Score,
		"comment":      br.Comment,
		"assignedAt":   br.AssignedAt.Format("2006-01-02 15:04:05"),
		"reviewedAt":   reviewedAt,
	})
}

func GetBlindReviewProgress(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	if contestTitle == "" {
		resp.Fail(c, "竞赛名称不能为空")
		return
	}

	reviews, err := service.ListBlindReviewsByContest(contestTitle)
	if err != nil {
		resp.Fail(c, "获取评审进度失败")
		return
	}

	total := len(reviews)
	reviewed := 0

	for _, r := range reviews {
		if r.Reviewed {
			reviewed++
		}
	}

	progress := 0
	if total > 0 {
		progress = (reviewed * 100) / total
	}

	resp.OK(c, gin.H{
		"contestTitle": contestTitle,
		"total":        total,
		"reviewed":     reviewed,
		"pending":      total - reviewed,
		"progress":     progress,
	})
}

func DeleteBlindReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "评审ID无效")
		return
	}

	err = service.DeleteBlindReview(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}

	resp.OK(c, "删除成功")
}
