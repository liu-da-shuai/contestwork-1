package entity

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"unique;comment:账号" json:"username"`
	Password string `comment:"密码" json:"password"`
	Role     string `comment:"admin/teacher/reviewer" json:"role"`
	Name     string `comment:"姓名" json:"name"`
}
