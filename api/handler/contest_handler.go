package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListContest(c *gin.Context) {
	list, _ := service.ListContest()
	resp.OK(c, list)
}

func GetContestDetail(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	info, _ := service.GetContestByID(uint(id))
	resp.OK(c, info)
}

func CreateContest(c *gin.Context) {
	var contest entity.Contest
	_ = c.ShouldBindJSON(&contest)
	err := service.CreateContest(&contest)
	if err != nil {
		resp.Fail(c, "创建失败")
		return
	}
	resp.OK(c, "创建成功")
}

func UpdateContest(c *gin.Context) {
	var contest entity.Contest
	_ = c.ShouldBindJSON(&contest)
	err := service.UpdateContest(&contest)
	if err != nil {
		resp.Fail(c, "更新失败")
		return
	}
	resp.OK(c, "更新成功")
}

func DeleteContest(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := service.DeleteContest(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}
	resp.OK(c, "删除成功")
}

func ListContestByStatus(c *gin.Context) {
	status := c.Query("status")
	list, _ := service.ListContestByStatus(status)
	resp.OK(c, list)
}

func SearchContest(c *gin.Context) {
	keyword := c.Query("keyword")
	if keyword == "" {
		resp.Fail(c, "关键词不能为空")
		return
	}
	list, err := service.SearchContest(keyword)
	if err != nil {
		resp.Fail(c, "搜索失败")
		return
	}
	resp.OK(c, list)
}
