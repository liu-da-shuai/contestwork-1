package handler

import (
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
