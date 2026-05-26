package handler

import (
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"fmt"
	"io"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var allowedExtensions = []string{
	// 文档类
	".doc", ".docx", ".pdf", ".txt", ".rtf",
	// 表格类
	".xls", ".xlsx", ".csv",
	// 演示文稿
	".ppt", ".pptx",
	// 图片类
	".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
	// 压缩文件
	".zip", ".rar", ".7z",
	// 其他
	".json", ".xml", ".md",
}

func isAllowedExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, allowed := range allowedExtensions {
		if ext == allowed {
			return true
		}
	}
	return false
}

func UploadAttachment(c *gin.Context) {
	signupIDStr := c.PostForm("signup_id")
	signupID, err := strconv.Atoi(signupIDStr)
	if err != nil || signupID <= 0 {
		resp.Fail(c, "报名ID无效")
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		resp.Fail(c, "请选择要上传的文件")
		return
	}

	if !isAllowedExtension(file.Filename) {
		resp.Fail(c, "不支持的文件格式")
		return
	}

	maxSize := int64(50 * 1024 * 1024)
	if file.Size > maxSize {
		resp.Fail(c, "文件大小不能超过50MB")
		return
	}

	uploadDir := "./uploads"
	os.MkdirAll(uploadDir, os.ModePerm)

	timestamp := time.Now().Unix()
	ext := filepath.Ext(file.Filename)
	newFilename := fmt.Sprintf("%d_%d%s", signupID, timestamp, ext)
	filePath := filepath.Join(uploadDir, newFilename)

	out, err := os.Create(filePath)
	if err != nil {
		resp.Fail(c, "创建文件失败")
		return
	}
	defer out.Close()

	src, err := file.Open()
	if err != nil {
		resp.Fail(c, "打开文件失败")
		return
	}
	defer src.Close()

	_, err = io.Copy(out, src)
	if err != nil {
		resp.Fail(c, "保存文件失败")
		return
	}

	err = service.CreateAttachmentFromUpload(
		uint(signupID),
		newFilename,
		file.Filename,
		filePath,
		file.Size,
		ext,
	)
	if err != nil {
		resp.Fail(c, "保存附件记录失败")
		return
	}

	resp.OK(c, gin.H{
		"id":           signupID,
		"filename":     newFilename,
		"originalName": file.Filename,
		"fileSize":     file.Size,
		"message":      "上传成功",
	})
}

func ListAttachments(c *gin.Context) {
	signupIDStr := c.Query("signup_id")
	signupID, err := strconv.Atoi(signupIDStr)
	if err != nil || signupID <= 0 {
		resp.Fail(c, "报名ID无效")
		return
	}

	list, err := service.ListAttachmentsBySignupID(uint(signupID))
	if err != nil {
		resp.Fail(c, "获取附件列表失败")
		return
	}

	resp.OK(c, list)
}

func DeleteAttachment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "附件ID无效")
		return
	}

	attachment, err := service.GetAttachmentByID(uint(id))
	if err != nil {
		resp.Fail(c, "附件不存在")
		return
	}

	os.Remove(attachment.FilePath)

	err = service.DeleteAttachment(uint(id))
	if err != nil {
		resp.Fail(c, "删除失败")
		return
	}

	resp.OK(c, "删除成功")
}

func DownloadAttachment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "附件ID无效")
		return
	}

	attachment, err := service.GetAttachmentByID(uint(id))
	if err != nil {
		resp.Fail(c, "附件不存在")
		return
	}

	encodedName := url.QueryEscape(attachment.OriginalName)
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"; filename*=UTF-8''%s", attachment.OriginalName, encodedName))
	c.Header("Content-Type", "application/octet-stream")
	c.File(attachment.FilePath)
}

func UploadMultipleAttachments(c *gin.Context) {
	signupIDStr := c.PostForm("signup_id")
	signupID, err := strconv.Atoi(signupIDStr)
	if err != nil || signupID <= 0 {
		resp.Fail(c, "报名ID无效")
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		resp.Fail(c, "获取表单数据失败")
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		resp.Fail(c, "请选择要上传的文件")
		return
	}

	successCount := 0
	failedCount := 0
	failedNames := []string{}

	for _, file := range files {
		if !isAllowedExtension(file.Filename) {
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		maxSize := int64(50 * 1024 * 1024)
		if file.Size > maxSize {
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		uploadDir := "./uploads"
		os.MkdirAll(uploadDir, os.ModePerm)

		timestamp := time.Now().UnixNano()
		ext := filepath.Ext(file.Filename)
		newFilename := fmt.Sprintf("%d_%d%s", signupID, timestamp, ext)
		filePath := filepath.Join(uploadDir, newFilename)

		out, err := os.Create(filePath)
		if err != nil {
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		src, err := file.Open()
		if err != nil {
			out.Close()
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		_, err = io.Copy(out, src)
		src.Close()
		out.Close()

		if err != nil {
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		err = service.CreateAttachmentFromUpload(
			uint(signupID),
			newFilename,
			file.Filename,
			filePath,
			file.Size,
			ext,
		)
		if err != nil {
			failedCount++
			failedNames = append(failedNames, file.Filename)
			continue
		}

		successCount++
	}

	result := gin.H{
		"successCount": successCount,
		"failedCount":  failedCount,
		"message":      fmt.Sprintf("成功上传%d个文件，失败%d个", successCount, failedCount),
	}

	if failedCount > 0 {
		result["failedNames"] = failedNames
	}

	resp.OK(c, result)
}
