package entity

type SignUp struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	ContestTitle string `comment:"竞赛名" json:"contest_title"`
	TeacherName  string `comment:"教师名" json:"teacher_name"`
	Unit         string `comment:"单位" json:"unit"`
	Phone        string `comment:"电话" json:"phone"`
	CourseName   string `comment:"课程名" json:"course_name"`
	Grade        string `comment:"年级" json:"grade"`
	Desc         string `comment:"设计简介" json:"desc"`
	Time         string `comment:"报名时间" json:"time"`
}
