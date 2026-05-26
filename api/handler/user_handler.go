package handler

import (
	"contestwork-1/model/entity"
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LoginReq struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UpdatePasswordReq struct {
	ID     uint   `json:"id"`
	OldPwd string `json:"old_pwd"`
	NewPwd string `json:"new_pwd"`
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

func GetUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	u, err := service.GetUserByID(uint(id))
	if err != nil {
		resp.Fail(c, "用户不存在")
		return
	}
	resp.OK(c, u)
}

func UpdateUser(c *gin.Context) {
	var u entity.User
	_ = c.ShouldBindJSON(&u)
	err := service.UpdateUser(&u)
	if err != nil {
		resp.Fail(c, "更新失败")
		return
	}
	resp.OK(c, "更新成功")
}

func DeleteUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	err := service.DeleteUser(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}
	resp.OK(c, "删除成功")
}

func UpdatePassword(c *gin.Context) {
	var req UpdatePasswordReq
	_ = c.ShouldBindJSON(&req)
	ok := service.UpdatePassword(req.ID, req.OldPwd, req.NewPwd)
	if !ok {
		resp.Fail(c, "原密码错误")
		return
	}
	resp.OK(c, "密码修改成功")
}

func ListUserByRole(c *gin.Context) {
	role := c.Query("role")
	list, _ := service.ListUserByRole(role)
	resp.OK(c, list)
}
