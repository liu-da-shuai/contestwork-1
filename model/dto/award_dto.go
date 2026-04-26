package dto

type AwardReq struct {
	Teacher string `json:"teacher"`
	Title   string `json:"title"`
	Award   string `json:"award"`
}

type AwardResp struct {
	ID      uint   `json:"id"`
	Teacher string `json:"teacher"`
	Title   string `json:"title"`
	Award   string `json:"award"`
}
