// 统一返回
package resp

import "github.com/gin-gonic/gin"

func OK(c *gin.Context, data any) {
	c.JSON(200, gin.H{
		"code": 1,
		"msg":  "success",
		"data": data,
	})
}

func Fail(c *gin.Context, msg string) {
	c.JSON(200, gin.H{
		"code": 0,
		"msg":  msg,
	})
}
