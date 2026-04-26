package dto

type ReviewReq struct {
	ContestTitle string `json:"contestTitle"`
	TeacherName  string `json:"teacherName"`
	CourseName   string `json:"courseName"`
	Score        int    `json:"score"`
	Comment      string `json:"comment"`
}

type ReviewResp struct {
	ID           uint   `json:"id"`
	ContestTitle string `json:"contestTitle"`
	TeacherName  string `json:"teacherName"`
	CourseName   string `json:"courseName"`
	Score        int    `json:"score"`
	Comment      string `json:"comment"`
}
