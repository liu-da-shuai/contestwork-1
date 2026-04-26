package dto

type ContestResp struct {
	ID     uint   `json:"id"`
	Title  string `json:"title"`
	Time   string `json:"time"`
	Status string `json:"status"`
}
