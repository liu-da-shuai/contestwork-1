package dto

type SignUpReq struct {
	ContestTitle string `json:"contestTitle"`
	TeacherName  string `json:"teacherName"`
	Unit         string `json:"unit"`
	Phone        string `json:"phone"`
	CourseName   string `json:"courseName"`
	Grade        string `json:"grade"`
	Desc         string `json:"desc"`
}

type SignUpResp struct {
	ID           uint   `json:"id"`
	ContestTitle string `json:"contestTitle"`
	TeacherName  string `json:"teacherName"`
	Unit         string `json:"unit"`
	CourseName   string `json:"courseName"`
	Score        int    `json:"score,omitempty"`
}
