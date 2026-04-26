package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

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
