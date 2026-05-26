package service

import (
	"contestwork-1/dao"
	"contestwork-1/model/entity"
	"time"
)

func CreateAttachment(a *entity.Attachment) error {
	return dao.CreateAttachment(a)
}

func ListAttachmentsBySignupID(signupID uint) ([]entity.Attachment, error) {
	return dao.ListAttachmentsBySignupID(signupID)
}

func GetAttachmentByID(id uint) (entity.Attachment, error) {
	return dao.GetAttachmentByID(id)
}

func DeleteAttachment(id uint) error {
	return dao.DeleteAttachment(id)
}

func DeleteAttachmentsBySignupID(signupID uint) error {
	return dao.DeleteAttachmentsBySignupID(signupID)
}

func CreateAttachmentFromUpload(signupID uint, filename, originalName, filePath string, fileSize int64, fileType string) error {
	return dao.CreateAttachment(&entity.Attachment{
		SignupID:     signupID,
		Filename:     filename,
		OriginalName: originalName,
		FilePath:     filePath,
		FileSize:     fileSize,
		FileType:     fileType,
		UploadTime:   time.Now(),
	})
}
