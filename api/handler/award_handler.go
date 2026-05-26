package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateAward(c *gin.Context) {
	var r entity.Award
	_ = c.ShouldBindJSON(&r)
	_ = service.CreateAward(&r)
	resp.OK(c, "添加成功")
}

func ListAward(c *gin.Context) {
	list, _ := service.ListAward()
	resp.OK(c, list)
}

func GetAward(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	a, err := service.GetAwardByID(uint(id))
	if err != nil {
		resp.Fail(c, "获奖信息不存在")
		return
	}
	resp.OK(c, a)
}

func UpdateAward(c *gin.Context) {
	var a entity.Award
	_ = c.ShouldBindJSON(&a)
	err := service.UpdateAward(&a)
	if err != nil {
		resp.Fail(c, "更新失败")
		return
	}
	resp.OK(c, "更新成功")
}

func DeleteAward(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := service.DeleteAward(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}
	resp.OK(c, "删除成功")
}

func ListAwardByTeacher(c *gin.Context) {
	teacher := c.Query("teacher")
	list, _ := service.ListAwardByTeacher(teacher)
	resp.OK(c, list)
}

func ListAwardByTitle(c *gin.Context) {
	title := c.Query("title")
	list, _ := service.ListAwardByTitle(title)
	resp.OK(c, list)
}
