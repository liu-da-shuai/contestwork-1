package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateSignUp(c *gin.Context) {
	var s entity.SignUp
	_ = c.ShouldBindJSON(&s)
	if s.Time == "" {
		s.Time = time.Now().Format("2006-01-02")
	}
	_ = service.CreateSignUp(&s)
	resp.OK(c, "报名成功")
}

func ListSignUP(c *gin.Context) {
	list, _ := service.ListSignUp()
	resp.OK(c, list)
}

func GetSignUp(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	s, err := service.GetSignUpByID(uint(id))
	if err != nil {
		resp.Fail(c, "报名信息不存在")
		return
	}
	resp.OK(c, s)
}

func UpdateSignUp(c *gin.Context) {
	var s entity.SignUp
	_ = c.ShouldBindJSON(&s)
	err := service.UpdateSignUp(&s)
	if err != nil {
		resp.Fail(c, "更新失败")
		return
	}
	resp.OK(c, "更新成功")
}

func DeleteSignUp(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := service.DeleteSignUp(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}
	resp.OK(c, "删除成功")
}

func ListSignUpByContest(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	list, _ := service.ListSignUpByContest(contestTitle)
	resp.OK(c, list)
}

func ListSignUpByTeacher(c *gin.Context) {
	teacherName := c.Query("teacher_name")
	list, _ := service.ListSignUpByTeacher(teacherName)
	resp.OK(c, list)
}
