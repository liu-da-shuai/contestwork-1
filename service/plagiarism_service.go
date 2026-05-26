package service

import (
	"contestwork-1/config"
	"contestwork-1/model/entity"
	"fmt"
	"math"
	"strings"
	"time"
)

func CreatePlagiarismCheck(signupID uint, contestTitle string) (*entity.PlagiarismCheck, error) {
	check := &entity.PlagiarismCheck{
		SignupID:     signupID,
		ContestTitle: contestTitle,
		CheckTime:    time.Now(),
		Similarity:   0,
		Status:       "pending",
	}
	if err := config.DB.Create(check).Error; err != nil {
		return nil, err
	}
	return check, nil
}

func RunPlagiarismCheck(checkID uint) error {
	var check entity.PlagiarismCheck
	if err := config.DB.First(&check, checkID).Error; err != nil {
		return err
	}

	var signup entity.SignUp
	if err := config.DB.First(&signup, check.SignupID).Error; err != nil {
		return err
	}

	var otherSignups []entity.SignUp
	config.DB.Where("id != ? AND contest_title = ?", check.SignupID, check.ContestTitle).Find(&otherSignups)

	maxSimilarity := 0.0
	var results []entity.PlagiarismResult

	for _, other := range otherSignups {
		similarity := calculateSimilarity(signup.Desc, other.Desc)
		if similarity > maxSimilarity {
			maxSimilarity = similarity
		}
		results = append(results, entity.PlagiarismResult{
			CheckID:        checkID,
			TargetSignupID: other.ID,
			Similarity:     similarity,
		})
	}

	if len(results) > 0 {
		config.DB.Create(&results)
	}

	var reportBuilder strings.Builder
	reportBuilder.WriteString("查重报告\n")
	reportBuilder.WriteString("====================\n")
	reportBuilder.WriteString("报名ID: " + fmt.Sprintf("%d", check.SignupID) + "\n")
	reportBuilder.WriteString("课程名: " + signup.CourseName + "\n")
	reportBuilder.WriteString("查重时间: " + check.CheckTime.Format("2006-01-02 15:04:05") + "\n")
	reportBuilder.WriteString(fmt.Sprintf("最高相似度: %.1f%%\n", maxSimilarity*100))
	reportBuilder.WriteString("\n详细对比:\n")
	for _, r := range results {
		if r.Similarity > 0.3 {
			var target entity.SignUp
			config.DB.First(&target, r.TargetSignupID)
			reportBuilder.WriteString(fmt.Sprintf("- 与报名ID %d 相似度: %.1f%%\n", r.TargetSignupID, r.Similarity*100))
		}
	}

	check.Similarity = maxSimilarity
	check.Status = "completed"
	check.Report = reportBuilder.String()

	return config.DB.Save(&check).Error
}

func GetPlagiarismCheck(id uint) (*entity.PlagiarismCheck, error) {
	var check entity.PlagiarismCheck
	if err := config.DB.First(&check, id).Error; err != nil {
		return nil, err
	}
	return &check, nil
}

func GetPlagiarismResults(checkID uint) ([]entity.PlagiarismResult, error) {
	var results []entity.PlagiarismResult
	if err := config.DB.Where("check_id = ?", checkID).Order("similarity desc").Find(&results).Error; err != nil {
		return nil, err
	}
	return results, nil
}

func ListPlagiarismChecks(contestTitle string) ([]entity.PlagiarismCheck, error) {
	var checks []entity.PlagiarismCheck
	query := config.DB.Model(&entity.PlagiarismCheck{})
	if contestTitle != "" {
		query = query.Where("contest_title = ?", contestTitle)
	}
	if err := query.Order("check_time desc").Find(&checks).Error; err != nil {
		return nil, err
	}
	return checks, nil
}

func calculateSimilarity(text1, text2 string) float64 {
	words1 := strings.Fields(text1)
	words2 := strings.Fields(text2)

	if len(words1) == 0 || len(words2) == 0 {
		return 0
	}

	freq1 := make(map[string]int)
	freq2 := make(map[string]int)

	for _, w := range words1 {
		freq1[w]++
	}
	for _, w := range words2 {
		freq2[w]++
	}

	allWords := make(map[string]bool)
	for w := range freq1 {
		allWords[w] = true
	}
	for w := range freq2 {
		allWords[w] = true
	}

	var dotProduct, norm1, norm2 float64
	for w := range allWords {
		v1 := float64(freq1[w])
		v2 := float64(freq2[w])
		dotProduct += v1 * v2
		norm1 += v1 * v1
		norm2 += v2 * v2
	}

	if norm1 == 0 || norm2 == 0 {
		return 0
	}

	return dotProduct / (math.Sqrt(norm1) * math.Sqrt(norm2))
}
