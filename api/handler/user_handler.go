package handler

import (
	"contestwork-1/pkg/resp"
	"contestwork-1/service"

	"github.com/gin-gonic/gin"
)

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func Login(c *gin.Context) {
	var req LoginReq
	_ = c.ShouldBindJSON(&req)
	u, ok := service.Login(req.Username, req.Password, req.Role)
	if !ok {
		resp.Fail(c, "账号或密码错误")
		return
	}
	resp.OK(c, gin.H{"name": u.Name, "role": u.Role})
}
func Register(c *gin.Context) {
	var req LoginReq
	_ = c.ShouldBindJSON(&req)
	ok := service.Register(req.Username, req.Password, req.Role, req.Username)
	if !ok {
		resp.Fail(c, "账号已存在")
		return
	}
	resp.OK(c, "注册成功")

}

func ListUser(c *gin.Context) {
	list, _ := service.ListUser()
	resp.OK(c, list)
}
