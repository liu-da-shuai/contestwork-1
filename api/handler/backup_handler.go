package handler

import (
	"contestwork-1/config"
	"contestwork-1/pkg/resp"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func BackupDatabase(c *gin.Context) {
	timestamp := time.Now().Format("20060102_150405")
	backupDir := "./backups"
	os.MkdirAll(backupDir, os.ModePerm)

	backupFile := filepath.Join(backupDir, fmt.Sprintf("backup_%s.sql", timestamp))

	db := config.DB
	sqlDB, err := db.DB()
	if err != nil {
		resp.Fail(c, "获取数据库连接失败")
		return
	}

	var tables []string
	rows, err := sqlDB.Query("SHOW TABLES")
	if err != nil {
		resp.Fail(c, "获取表列表失败")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var table string
		rows.Scan(&table)
		tables = append(tables, table)
	}

	file, err := os.Create(backupFile)
	if err != nil {
		resp.Fail(c, "创建备份文件失败")
		return
	}
	defer file.Close()

	file.WriteString("-- 数据库备份\n")
	file.WriteString(fmt.Sprintf("-- 备份时间: %s\n\n", time.Now().Format("2006-01-02 15:04:05")))

	for _, table := range tables {
		file.WriteString(fmt.Sprintf("-- 表: %s\n", table))

		file.WriteString(fmt.Sprintf("DROP TABLE IF EXISTS `%s`;\n", table))

		var createTable string
		err := sqlDB.QueryRow(fmt.Sprintf("SHOW CREATE TABLE `%s`", table)).Scan(&table, &createTable)
		if err != nil {
			continue
		}
		file.WriteString(createTable + ";\n\n")

		dataRows, err := sqlDB.Query(fmt.Sprintf("SELECT * FROM `%s`", table))
		if err != nil {
			continue
		}

		cols, _ := dataRows.Columns()
		values := make([]interface{}, len(cols))
		valuePtrs := make([]interface{}, len(cols))
		for i := range values {
			valuePtrs[i] = &values[i]
		}

		for dataRows.Next() {
			dataRows.Scan(valuePtrs...)
			insert := fmt.Sprintf("INSERT INTO `%s` VALUES (", table)
			for i, v := range values {
				if i > 0 {
					insert += ", "
				}
				if v == nil {
					insert += "NULL"
				} else {
					insert += fmt.Sprintf("'%v'", v)
				}
			}
			insert += ");\n"
			file.WriteString(insert)
		}
		dataRows.Close()
		file.WriteString("\n")
	}

	resp.OK(c, gin.H{
		"file":    backupFile,
		"message": "备份成功",
		"time":    time.Now().Format("2006-01-02 15:04:05"),
		"tables":  len(tables),
	})
}

func ListBackups(c *gin.Context) {
	backupDir := "./backups"
	files, err := os.ReadDir(backupDir)
	if err != nil {
		resp.OK(c, []interface{}{})
		return
	}

	var backups []gin.H
	for _, file := range files {
		if !file.IsDir() && filepath.Ext(file.Name()) == ".sql" {
			info, err := file.Info()
			if err != nil {
				continue
			}
			backups = append(backups, gin.H{
				"name":     file.Name(),
				"size":     info.Size(),
				"modified": info.ModTime().Format("2006-01-02 15:04:05"),
			})
		}
	}

	resp.OK(c, backups)
}

func DownloadBackup(c *gin.Context) {
	filename := c.Query("filename")
	if filename == "" {
		resp.Fail(c, "文件名不能为空")
		return
	}

	backupDir := "./backups"
	filePath := filepath.Join(backupDir, filename)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		resp.Fail(c, "备份文件不存在")
		return
	}

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/octet-stream")
	c.File(filePath)
}

func DeleteBackup(c *gin.Context) {
	filename := c.Query("filename")
	if filename == "" {
		resp.Fail(c, "文件名不能为空")
		return
	}

	backupDir := "./backups"
	filePath := filepath.Join(backupDir, filename)

	if err := os.Remove(filePath); err != nil {
		resp.Fail(c, "删除失败")
		return
	}

	resp.OK(c, "删除成功")
}

func RestoreDatabase(c *gin.Context) {
	filename := c.Query("filename")
	if filename == "" {
		resp.Fail(c, "文件名不能为空")
		return
	}

	backupDir := "./backups"
	filePath := filepath.Join(backupDir, filename)

	file, err := os.Open(filePath)
	if err != nil {
		resp.Fail(c, "备份文件不存在")
		return
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		resp.Fail(c, "读取备份文件失败")
		return
	}

	db := config.DB
	sqlDB, err := db.DB()
	if err != nil {
		resp.Fail(c, "获取数据库连接失败")
		return
	}

	_, err = sqlDB.Exec(string(content))
	if err != nil {
		resp.Fail(c, "恢复失败: "+err.Error())
		return
	}

	resp.OK(c, "恢复成功")
}
