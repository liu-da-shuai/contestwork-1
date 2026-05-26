package dao

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
)

func CreateAttachment(a *entity.Attachment) error {
	return config.DB.Create(a).Error
}

func ListAttachmentsBySignupID(signupID uint) ([]entity.Attachment, error) {
	var list []entity.Attachment
	err := config.DB.Where("signup_id = ?", signupID).Find(&list).Error
	return list, err
}

func GetAttachmentByID(id uint) (entity.Attachment, error) {
	var a entity.Attachment
	err := config.DB.Find(&a, id).Error
	return a, err
}

func DeleteAttachment(id uint) error {
	return config.DB.Delete(&entity.Attachment{}, id).Error
}

func DeleteAttachmentsBySignupID(signupID uint) error {
	return config.DB.Where("signup_id = ?", signupID).Delete(&entity.Attachment{}).Error
}
