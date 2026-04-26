package entity

type Contest struct {
	ID     uint   `gorm:"primaryKey"`
	Title  string `comment:"竞赛名称"`
	Time   string `comment:"时间"`
	Status string `comment:"进行中/已结束"`
}
