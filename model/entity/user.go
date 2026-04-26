package entity

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique;comment:账号"`
	Password string `comment:"密码"`
	Role     string `comment:"admin/techer/reviewer"`
	Name     string `comment:"姓名"`
}
