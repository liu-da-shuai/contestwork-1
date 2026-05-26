package entity

import "time"

type BlindReview struct {
	ID           uint       `gorm:"primaryKey"`
	ContestTitle string     `comment:"竞赛名称"`
	SignupID     uint       `comment:"报名ID"`
	ReviewerID   uint       `comment:"评审员ID"`
	ReviewerName string     `comment:"评审员姓名"`
	AssignedAt   time.Time  `comment:"分配时间"`
	Reviewed     bool       `comment:"是否已评审"`
	Score        int        `comment:"评分"`
	Comment      string     `comment:"评语"`
	ReviewedAt   *time.Time `comment:"评审时间"`
}
