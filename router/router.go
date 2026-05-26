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

	//管理面板
	r.GET("/admin/panel", handler.AdminPanel)

	//用户
	r.POST("/login", handler.Login)
	r.POST("/register", handler.Register)
	r.GET("/admin/user", handler.ListUser)
	r.GET("/admin/user/:id", handler.GetUser)
	r.PUT("/admin/user", handler.UpdateUser)
	r.DELETE("/admin/user/:id", handler.DeleteUser)
	r.PUT("/admin/user/password", handler.UpdatePassword)
	r.GET("/admin/user/role", handler.ListUserByRole)

	//竞赛
	r.GET("/contest/list", handler.ListContest)
	r.GET("/contest/detail/:id", handler.GetContestDetail)
	r.POST("/contest/add", handler.CreateContest)
	r.PUT("/contest/update", handler.UpdateContest)
	r.DELETE("/contest/delete/:id", handler.DeleteContest)
	r.GET("/contest/status", handler.ListContestByStatus)
	r.GET("/contest/search", handler.SearchContest)

	//报名
	r.POST("/signup/add", handler.CreateSignUp)
	r.GET("/signup/list", handler.ListSignUP)
	r.GET("/signup/detail/:id", handler.GetSignUp)
	r.PUT("/signup/update", handler.UpdateSignUp)
	r.DELETE("/signup/delete/:id", handler.DeleteSignUp)
	r.GET("/signup/contest", handler.ListSignUpByContest)
	r.GET("/signup/teacher", handler.ListSignUpByTeacher)

	//评审
	r.POST("/review/add", handler.CreateReview)
	r.GET("/review/list", handler.ListReview)
	r.GET("/review/detail/:id", handler.GetReview)
	r.PUT("/review/update", handler.UpdateReview)
	r.DELETE("/review/delete/:id", handler.DeleteReview)
	r.GET("/review/contest", handler.ListReviewByContest)
	r.GET("/review/teacher", handler.ListReviewByTeacher)

	//获奖
	r.POST("/award/add", handler.CreateAward)
	r.GET("/award/list", handler.ListAward)
	r.GET("/award/detail/:id", handler.GetAward)
	r.PUT("/award/update", handler.UpdateAward)
	r.DELETE("/award/delete/:id", handler.DeleteAward)
	r.GET("/award/teacher", handler.ListAwardByTeacher)
	r.GET("/award/title", handler.ListAwardByTitle)

	//统计
	r.GET("/statistics/contest", handler.ContestStatistics)
	r.GET("/statistics/teacher", handler.TeacherStatistics)
	r.GET("/statistics/overall", handler.OverallStatistics)

	//附件
	r.POST("/attachment/upload", handler.UploadAttachment)
	r.POST("/attachment/upload-multiple", handler.UploadMultipleAttachments)
	r.GET("/attachment/list", handler.ListAttachments)
	r.GET("/attachment/download/:id", handler.DownloadAttachment)
	r.DELETE("/attachment/delete/:id", handler.DeleteAttachment)

	//打印
	r.GET("/print/signup", handler.PrintSignupInfo)
	r.GET("/print/signup-list", handler.PrintSignupListByContest)

	//评审进度
	r.GET("/progress/review", handler.GetReviewProgress)
	r.GET("/progress/contests", handler.GetContestReviewProgress)
	r.GET("/progress/teacher", handler.GetTeacherReviewProgress)

	//盲审
	r.POST("/blind-review/assign", handler.AssignBlindReviews)
	r.GET("/blind-review/list", handler.GetBlindReviewsForReviewer)
	r.GET("/blind-review/detail/:id", handler.GetBlindReviewDetail)
	r.POST("/blind-review/submit", handler.SubmitBlindReview)
	r.GET("/blind-review/progress", handler.GetBlindReviewProgress)
	r.DELETE("/blind-review/delete/:id", handler.DeleteBlindReview)

	//个人中心
	r.GET("/personal/center", handler.PersonalCenter)

	//数据备份
	r.POST("/backup/create", handler.BackupDatabase)
	r.GET("/backup/list", handler.ListBackups)
	r.GET("/backup/download", handler.DownloadBackup)
	r.DELETE("/backup/delete", handler.DeleteBackup)
	r.POST("/backup/restore", handler.RestoreDatabase)

	//作品查重
	r.POST("/plagiarism/create", handler.CreatePlagiarismCheck)
	r.GET("/plagiarism/list", handler.ListPlagiarismChecks)
	r.GET("/plagiarism/detail/:id", handler.GetPlagiarismCheck)
	r.GET("/plagiarism/results", handler.GetPlagiarismResults)
	r.POST("/plagiarism/run/:id", handler.RunPlagiarismCheckHandler)

	return r
}
