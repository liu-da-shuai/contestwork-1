package config

import (
	"contestwork-1/model/entity"

	"gorm.io/driver/mysql"

	"gorm.io/gorm"
)

var DB *gorm.DB

func InitMySQL() {
	dsn := "root:ljx666@tcp(127.0.0.1:3306)/teaching_contest?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("mysql connect failed")
	}

	DB = db
	//自动建表
	_ = db.AutoMigrate(
		&entity.User{},
		&entity.Contest{},
		&entity.SignUp{},
		&entity.Review{},
		&entity.Award{},
		&entity.Attachment{},
		&entity.BlindReview{},
		&entity.PlagiarismCheck{},
		&entity.PlagiarismResult{},
		&entity.ReviewRound{},
		&entity.RoundReview{},
	)
}
