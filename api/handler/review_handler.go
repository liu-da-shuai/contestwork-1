package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateReview(c *gin.Context) {
	var r entity.Review
	_ = c.ShouldBindJSON(&r)
	_ = service.CreateReview(&r)
	resp.OK(c, "评分成功")
}

func ListReview(c *gin.Context) {
	list, _ := service.ListReview()
	resp.OK(c, list)
}

func GetReview(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	r, err := service.GetReviewByID(uint(id))
	if err != nil {
		resp.Fail(c, "评审信息不存在")
		return
	}
	resp.OK(c, r)
}

func UpdateReview(c *gin.Context) {
	var r entity.Review
	_ = c.ShouldBindJSON(&r)
	err := service.UpdateReview(&r)
	if err != nil {
		resp.Fail(c, "更新失败")
		return
	}
	resp.OK(c, "更新成功")
}

func DeleteReview(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := service.DeleteReview(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}
	resp.OK(c, "删除成功")
}

func ListReviewByContest(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	list, _ := service.ListReviewByContest(contestTitle)
	resp.OK(c, list)
}

func ListReviewByTeacher(c *gin.Context) {
	teacherName := c.Query("teacher_name")
	list, _ := service.ListReviewByTeacher(teacherName)
	resp.OK(c, list)
}
