package handler

import (
	"contestwork-1/pkg/resp"
	"contestwork-1/service"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

func PrintSignupInfo(c *gin.Context) {
	idStr := c.Query("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		resp.Fail(c, "报名ID无效")
		return
	}

	signup, err := service.GetSignUpByID(uint(id))
	if err != nil {
		resp.Fail(c, "报名信息不存在")
		return
	}

	attachments, _ := service.ListAttachmentsBySignupID(uint(id))

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>竞赛报名信息</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #333; }
        .subtitle { font-size: 14px; color: #666; margin-top: 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .info-table th { width: 120px; text-align: right; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; font-weight: normal; }
        .info-table td { padding: 10px; border: 1px solid #ddd; }
        .attachments { margin-top: 30px; }
        .attachments h3 { font-size: 16px; color: #333; margin-bottom: 10px; }
        .attachment-item { padding: 8px 0; border-bottom: 1px dashed #eee; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        @media print {
            body { margin: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">教学竞赛报名信息</div>
        <div class="subtitle">Teaching Contest Registration Form</div>
    </div>
    
    <table class="info-table">
        <tr><th>竞赛名称</th><td>%s</td></tr>
        <tr><th>教师姓名</th><td>%s</td></tr>
        <tr><th>单位</th><td>%s</td></tr>
        <tr><th>联系电话</th><td>%s</td></tr>
        <tr><th>课程名称</th><td>%s</td></tr>
        <tr><th>年级</th><td>%s</td></tr>
        <tr><th>设计简介</th><td>%s</td></tr>
        <tr><th>报名时间</th><td>%s</td></tr>
    </table>`,
		signup.ContestTitle,
		signup.TeacherName,
		signup.Unit,
		signup.Phone,
		signup.CourseName,
		signup.Grade,
		signup.Desc,
		signup.Time,
	)

	if len(attachments) > 0 {
		htmlContent += `
    <div class="attachments">
        <h3>附件列表</h3>`
		for _, att := range attachments {
			htmlContent += fmt.Sprintf(`<div class="attachment-item">• %s (%d KB)</div>`, att.OriginalName, att.FileSize/1024)
		}
		htmlContent += `</div>`
	}

	htmlContent += `
    <div class="footer">--- 报名信息打印页 ---</div>
</body>
</html>`

	c.Header("Content-Type", "text/html; charset=utf-8")
	c.String(200, htmlContent)
}

func PrintSignupListByContest(c *gin.Context) {
	contestTitle := c.Query("contest_title")
	if contestTitle == "" {
		resp.Fail(c, "竞赛名称不能为空")
		return
	}

	signups, err := service.ListSignUpByContest(contestTitle)
	if err != nil {
		resp.Fail(c, "获取报名列表失败")
		return
	}

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>%s - 报名名单</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #333; }
        .subtitle { font-size: 14px; color: #666; margin-top: 10px; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .data-table th, .data-table td { padding: 12px; border: 1px solid #ddd; text-align: center; }
        .data-table th { background: #f5f5f5; font-weight: bold; }
        .data-table tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        .summary { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
        @media print {
            body { margin: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">%s</div>
        <div class="subtitle">报名名单汇总</div>
    </div>
    
    <table class="data-table">
        <thead>
            <tr>
                <th>序号</th>
                <th>教师姓名</th>
                <th>单位</th>
                <th>课程名称</th>
                <th>年级</th>
                <th>报名时间</th>
            </tr>
        </thead>
        <tbody>`, contestTitle, contestTitle)

	for i, signup := range signups {
		htmlContent += fmt.Sprintf(`
            <tr>
                <td>%d</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
            </tr>`,
			i+1,
			signup.TeacherName,
			signup.Unit,
			signup.CourseName,
			signup.Grade,
			signup.Time,
		)
	}

	htmlContent += fmt.Sprintf(`
        </tbody>
    </table>
    
    <div class="summary">
        <strong>汇总统计：</strong> 共 %d 人报名
    </div>
    
    <div class="footer">--- 报名名单打印页 ---</div>
</body>
</html>`, len(signups))

	c.Header("Content-Type", "text/html; charset=utf-8")
	c.String(200, htmlContent)
}
