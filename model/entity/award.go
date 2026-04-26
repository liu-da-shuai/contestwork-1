package entity

type Award struct {
	ID      uint `gorm:"primaryKey"`
	Teacher string
	Title   string
	Award   string
}
