/*
Copyright Vadim Uvin (Swisscom AG). 2017 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"crypto/x509"
	"encoding/pem"
	"github.com/golang/protobuf/proto"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/msp"
	"encoding/json"
	"errors"
	//"fmt"
	"github.com/hyperledger/fabric/core/chaincode/lib/cid" 
	
   	
)

func parsePEM(certPEM string) (*x509.Certificate, error) {
	block, _ := pem.Decode([]byte(certPEM))
	if block == nil {
		return nil, errors.New("Failed to parse PEM certificate")
	}

	return x509.ParseCertificate(block.Bytes)
}

// extracts CN from an x509 certificate
func CNFromX509(certPEM string) (string, error) {
	cert, err := parsePEM(certPEM)
	if err != nil {
		return "", errors.New("Failed to parse certificate: " + err.Error())
	}
	return cert.Subject.CommonName, nil
}

// extracts CN from caller of a chaincode function
func CallerCN(stub shim.ChaincodeStubInterface) (string, error) {
	//mspid, err := cid.GetMSPID(stub)
	//cert, err := cid.GetX509Certificate(stub)
	data, _ := stub.GetCreator()
	serializedId := msp.SerializedIdentity{}
	errr := proto.Unmarshal(data, &serializedId)
	if errr != nil {
		return "", errors.New("Could not unmarshal Creator")
	}

	cn, err := CNFromX509(string(serializedId.IdBytes))
	if err != nil {
		return "", err
	}
	return cn, nil
}

func update_auth_call(APIstub shim.ChaincodeStubInterface, consentId string) bool {
	consent,_ :=get_consent(APIstub, consentId)
	consent.NumAuthCall=consent.NumAuthCall-1
	consentAsBytes, _ := json.Marshal(consent)
	APIstub.PutState(consent.Id,consentAsBytes)
	return true
}

func get_token(APIstub shim.ChaincodeStubInterface, id string) (Token,error) {
	var  token Token
	tokenAsBytes, err := APIstub.GetState(id)  
	json.Unmarshal(tokenAsBytes, &token)   

	if err != nil {                                          
		return token, errors.New("Failed to find marble - " + id)
	}
	             
	return token,nil
}

func get_consent(APIstub shim.ChaincodeStubInterface, id string) (Consent,error) {
	var  consent Consent
	consentAsBytes, err := APIstub.GetState(id)  
	json.Unmarshal(consentAsBytes, &consent)   

	if err != nil {                                          
		return consent, errors.New("Failed to find marble - " + id)
	}
	             
	return consent,nil
}

func is_it_auth(APIstub shim.ChaincodeStubInterface, tokenID string) (bool,error) {
	caller , _ :=CallerCN(APIstub)
	token,_ :=get_token(APIstub, tokenID)
	consent,err:= get_consent(APIstub, tokenID+"a")
	if err != nil {
		return false, errors.New("can't find consent for this token")
	}
	mspid, _ := cid.GetMSPID(APIstub)
	if caller == token.Creator{
		return true,nil
	}else if consent.ToOrg && mspid==consent.Requestor && consent.NumAuthCall>0{
		return true,nil	
	} else if consent.Requestor!=caller || consent.NumAuthCall<1 {
		err:="This user is not allowed to use this token : "+ tokenID
		return false, errors.New(err)
		//return false,fmt.Errorf("This user is not allowed to use this token : ", tokenID)
	}else if consent.Requestor==caller || consent.NumAuthCall>0{ 	 
		return true,nil
	}else {
		 return false, errors.New("Something wrong")
	}

}

func indexOf(element string, data []string) (int) {
	for k, v := range data {
		if element == v {
			return k
		}
	}
	return -1    //not found.
}

func RemoveIndex(s []string, index int) []string {
	return append(s[:index], s[index+1:]...)
}
