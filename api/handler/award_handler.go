package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

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
