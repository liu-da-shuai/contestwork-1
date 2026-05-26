package entity

import "time"

type Attachment struct {
	ID           uint      `gorm:"primaryKey"`
	SignupID     uint      `comment:"关联的报名ID"`
	Filename     string    `comment:"原始文件名"`
	OriginalName string    `comment:"上传时的原始文件名"`
	FilePath     string    `comment:"文件存储路径"`
	FileSize     int64     `comment:"文件大小（字节）"`
	FileType     string    `comment:"文件类型/扩展名"`
	UploadTime   time.Time `comment:"上传时间"`
}
