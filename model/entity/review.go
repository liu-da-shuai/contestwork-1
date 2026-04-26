package entity

type Review struct {
	ID           uint `gorm:"primaryKey"`
	ContestTitle string
	TeacherName  string
	CourseName   string
	Score        int
	Comment      string
}
