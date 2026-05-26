package handler

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreatePlagiarismCheck(c *gin.Context) {
	var req struct {
		SignupID     uint   `json:"signup_id"`
		ContestTitle string `json:"contest_title"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		resp.Fail(c, "参数错误")
		return
	}

	if req.SignupID == 0 {
		resp.Fail(c, "报名ID不能为空")
		return
	}

	var signup entity.SignUp
	if err := config.DB.First(&signup, req.SignupID).Error; err != nil {
		resp.Fail(c, "报名记录不存在")
		return
	}

	check, err := service.CreatePlagiarismCheck(req.SignupID, signup.ContestTitle)
	if err != nil {
		resp.Fail(c, "创建查重任务失败")
		return
	}

	go service.RunPlagiarismCheck(check.ID)

	resp.OK(c, gin.H{
		"check_id": check.ID,
		"message":  "查重任务已创建，正在后台执行",
	})
}

func GetPlagiarismCheck(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "查重ID无效")
		return
	}

	check, err := service.GetPlagiarismCheck(uint(id))
	if err != nil {
		resp.Fail(c, "查重记录不存在")
		return
	}

	resp.OK(c, check)
}

func GetPlagiarismResults(c *gin.Context) {
	checkIDStr := c.Query("check_id")
	checkID, err := strconv.Atoi(checkIDStr)
	if err != nil || checkID <= 0 {
		resp.Fail(c, "查重ID无效")
		return
	}

	results, err := service.GetPlagiarismResults(uint(checkID))
	if err != nil {
		resp.Fail(c, "获取查重结果失败")
		return
	}

	resp.OK(c, results)
}

func ListPlagiarismChecks(c *gin.Context) {
	contestTitle := c.Query("contest_title")

	checks, err := service.ListPlagiarismChecks(contestTitle)
	if err != nil {
		resp.Fail(c, "获取查重列表失败")
		return
	}

	resp.OK(c, checks)
}

func RunPlagiarismCheckHandler(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "查重ID无效")
		return
	}

	err = service.RunPlagiarismCheck(uint(id))
	if err != nil {
		resp.Fail(c, "执行查重失败")
		return
	}

	resp.OK(c, "查重完成")
}
