package entity

import "time"

type PlagiarismCheck struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	SignupID     uint      `comment:"报名ID" json:"signup_id"`
	ContestTitle string    `comment:"竞赛名称" json:"contest_title"`
	CheckTime    time.Time `comment:"查重时间" json:"check_time"`
	Similarity   float64   `comment:"最高相似度" json:"similarity"`
	Status       string    `comment:"状态:pending/completed" json:"status"`
	Report       string    `comment:"查重报告" json:"report"`
}

type PlagiarismResult struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	CheckID        uint    `comment:"查重记录ID" json:"check_id"`
	TargetSignupID uint    `comment:"对比报名ID" json:"target_signup_id"`
	Similarity     float64 `comment:"相似度" json:"similarity"`
}
