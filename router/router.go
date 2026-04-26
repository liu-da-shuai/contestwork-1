package router

import (
	"contestwork-1/api/handler"
	_ "contestwork-1/docs"
	"contestwork-1/middleware"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.Cors())
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	//用户
	r.POST("/login", handler.Login)
	r.POST("/register", handler.Register)
	r.GET("/admin/user", handler.ListUser)

	//竞赛
	r.GET("/contest/list", handler.ListContest)
	r.GET("/contest/detail/:id", handler.GetContestDetail)

	//报名
	r.POST("/signup/add", handler.CreateSignUp)
	r.GET("/signup/list", handler.ListSignUP)

	//评审
	r.POST("/review/add", handler.CreateReview)
	r.GET("/review/list", handler.ListReview)

	//获奖
	r.POST("/award/add", handler.CreateAward)
	r.GET("/award/list", handler.ListAward)

	return r
}
