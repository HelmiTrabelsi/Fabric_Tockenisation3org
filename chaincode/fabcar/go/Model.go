
package main

import ("time")
type Token struct {
	Id    string `json:"id"`
	Creator        string `json:"creator"`
	Data      string `json:"data"`
	Creation_date  time.Time   `json:"Creation_date"`
	Hash string `json:hash`
	Output  []string `json:"output"`
	Input  []string `json:"input"`
	Finalized bool `json:finalised`
}

type Consent struct {
	Id string `json:"consentId"`
	TokenId string `json:"tokenId"`
	Owner string `json:"owner"`
	Requestor string `json:"requestor"`
	NumAuthCall int `json :"NumAuthCall"`
	Timestamp time.Time	`json:"timestamp"`
	ToOrg bool `json :"toOrg"`

}




