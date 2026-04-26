// @title contestwork-1 教学竞赛系统接口文档
// @version 1.0
// @description 分组项目后端接口文档 | 项目名：contestwork-1
// @termsOfService http://localhost:8080
// @contact.name 后端开发
// @host localhost:8080
// @BasePath /
package main

import (
	"contestwork-1/config"
	"contestwork-1/router"
)

func main() {
	//初始化MySQL
	config.InitMySQL()

	//初始化Redis
	config.InitRedis()

	//初始化路由
	r := router.InitRouter()
	_ = r.Run(":8080")
}
