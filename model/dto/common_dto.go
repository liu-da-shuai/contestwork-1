package dto

// PageResp 通用分页返回
type PageResp struct {
	Total int64       `json:"total"`
	List  interface{} `json:"list"`
}
