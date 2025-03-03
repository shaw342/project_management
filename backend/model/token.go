package model

type Tokens struct {
	TokenId string `json:"tokenId" fauna:"tokenId"`
	Secret   string `json:"secret" fauna:"secret"`
}
