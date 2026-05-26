package handler

import (
	"github.com/gin-gonic/gin"
)

func PersonalCenter(c *gin.Context) {
	c.Header("Content-Type", "text/html; charset=utf-8")
	c.File("./web/personal/index.html")
}
