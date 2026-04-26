package entity

type SignUp struct {
	ID           uint   `gorm:"primaryKey"`
	ContestTitle string `comment:"竞赛名"`
	TeacherName  string `comment:"教师名"`
	Unit         string `comment:"单位"`
	Phone        string `comment:"电话"`
	CourseName   string `comment:"课程名"`
	Grade        string `comment:"年级"`
	Desc         string `comment:"设计简介"`
	Time         string `comment:"报名时间"`
}
