package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

	"github.com/gin-gonic/gin"
)

func CreateSignUp(c *gin.Context) {
	var s entity.SignUp
	_ = c.ShouldBindJSON(&s)
	_ = service.CreateSignUp(&s)
	resp.OK(c, "报名成功")
}

func ListSignUP(c *gin.Context) {
	list, _ := service.ListSignUp()
	resp.OK(c, list)
}
