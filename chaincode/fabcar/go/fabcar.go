/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	//"bytes"
	//"image"
	//"os"
	"encoding/json"
	"fmt"
	"errors"
	"strconv"
	"time"
	"github.com/segmentio/ksuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"crypto/sha256"
	"encoding/base64"
	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
)

// Define the Smart Contract structure
type SmartContract struct {
}



/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "CreateToken" {
		return s.CreateToken(APIstub, args)
	} else if function == "GetToken" {
		return s.GetToken(APIstub, args)
	} else if function == "deleteToken" {
		return s.deleteToken(APIstub, args)
	} else if function == "GiveConsent" {
		return s.GiveConsent(APIstub, args)
	} else if function == "CreateTokenFromOther" {
		return s.CreateTokenFromOther(APIstub, args)
	} else if function == "GiveConsentToOrg" {
		return s.GiveConsentToOrg(APIstub, args)
	}

	

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) CreateToken(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	timestamp:= time.Now()
	id := ksuid.New().String()
	owner, err := CallerCN(APIstub)
	if err != nil {
		return shim.Error("Error getting from owner")
	}
	trace:=[]string{}
	var token= Token{Id:id,Creator:owner, Data:args[0], Creation_date:timestamp,Trace:trace }

	hasher:=id+timestamp.String()+token.Creator
	hash := sha256.New()
    hash.Write([]byte (hasher))
	sha := base64.URLEncoding.EncodeToString(hash.Sum(nil))
	token.Hash= sha

	tokenAsBytes, _ := json.Marshal(token)
	errr := APIstub.PutState(id,tokenAsBytes)
	if errr != nil {
		fmt.Printf("Error creating new Token: %s", errr)
	}
	return shim.Success(tokenAsBytes)
}

func (s *SmartContract) CreateTokenFromOther(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	timestamp:= time.Now()
	id := ksuid.New().String()
	owner, err := CallerCN(APIstub)
	if err != nil {
		return shim.Error("Error getting from owner")
	}

	data:=""
	caller , _ :=CallerCN(APIstub)
	var  consent Consent
	 
	for  i:=0;i<len(args); i++{
		consent,err= get_consent(APIstub, args[i]+"a")
		if err != nil {
			shim.Error("can't find consent")
		}

	}	
	mspid, _ := cid.GetMSPID(APIstub)
	if consent.ToOrg && mspid==consent.Requestor && consent.NumAuthCall>0{
		update_auth_call(APIstub, consent.Id) 
		//consentAsBytes, _ := json.Marshal(consent)
		for  i:=0;i<len(args); i++{
			token1,err:= get_token(APIstub, args[i])
			if err != nil {
				shim.Error("can't find token")
			}
			data=data+" "+token1.Creator
			token1.Trace=append(token1.Trace,id +" "+caller)
			tokenAsBytes1, _ := json.Marshal(token1)
			APIstub.PutState(token1.Id,tokenAsBytes1 )
		}           
		
	} else if consent.Requestor!=caller || consent.NumAuthCall<1 {
		return shim.Error(fmt.Sprintf("this user is not allowed to use this token", caller))
	}else { 
		update_auth_call(APIstub, consent.Id)            
		for  i:=0;i<len(args); i++{
			token1,err:= get_token(APIstub, args[i])
			if err != nil {
				shim.Error("can't find token")
			}
			data=data+" "+token1.Creator
			token1.Trace=append(token1.Trace,id +" "+caller)
			tokenAsBytes1, _ := json.Marshal(token1)
			APIstub.PutState(token1.Id,tokenAsBytes1 )
		}
	} 
	

	var token= Token{Id:id,Creator:owner, Data:data, Creation_date:timestamp }

	hasher:=id+timestamp.String()+token.Creator
	hash := sha256.New()
    hash.Write([]byte (hasher))
	sha := base64.URLEncoding.EncodeToString(hash.Sum(nil))
	token.Hash= sha

	tokenAsBytes, _ := json.Marshal(token)
	errr := APIstub.PutState(id,tokenAsBytes)
	if errr != nil {
		fmt.Printf("Error creating new Token: %s", errr)
	}
	return shim.Success(tokenAsBytes)
}

func (s *SmartContract) GetToken(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var  token Token
	var  consent Consent
	tokenAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		fmt.Printf("Token not found", err)
	}
	json.Unmarshal(tokenAsBytes, &token)
	consentAsBytes, err := APIstub.GetState(args[0] +"a")
	if err != nil {
		return shim.Error("consent not found")
	}
	json.Unmarshal(consentAsBytes, &consent)
	caller , _ :=CallerCN(APIstub)
	mspid, _ := cid.GetMSPID(APIstub)
	if token.Creator==caller {
 		return shim.Success(tokenAsBytes)
	}
	if consent.ToOrg && mspid==consent.Requestor && consent.NumAuthCall>0{
		update_auth_call(APIstub, consent.Id)            
		return shim.Success(consentAsBytes)
	} else if consent.Requestor!=caller || consent.NumAuthCall<2 {
		return shim.Error(fmt.Sprintf("this user is not allowed to read this token", consent.Requestor))
	}else { 
		update_auth_call(APIstub, consent.Id)            
		return shim.Success(tokenAsBytes)
	} 
		
	
}

func (s *SmartContract) deleteToken(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	token,err :=get_token(APIstub, args[0])
	invoker, err :=CallerCN(APIstub)

	if invoker!=token.Creator{
		return shim.Error("this user is not authorised to delete this token")
	}

	err = APIstub.DelState(args[0])
	if err != nil {
		return shim.Error("Failed to delete Token from the state")
	}

	return shim.Success(nil)
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

func (s *SmartContract) GiveConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	timestamp:= time.Now()
	num, err := strconv.Atoi(args[2])
	var consent= Consent{Id:token.Id+"a" ,TokenId:token.Id ,Owner:token.Creator ,Requestor:args[1] ,NumAuthCall:num ,Timestamp:timestamp, ToOrg:false }
	consentAsBytes, _ := json.Marshal(consent)
	APIstub.PutState(consent.Id,consentAsBytes)
	return shim.Success(consentAsBytes)
}	


func update_auth_call(APIstub shim.ChaincodeStubInterface, consentId string) bool {
	consent,_ :=get_consent(APIstub, consentId)
	consent.NumAuthCall=consent.NumAuthCall-1
	consentAsBytes, _ := json.Marshal(consent)
	APIstub.PutState(consent.Id,consentAsBytes)
	return true
}

func (s *SmartContract) GiveConsentToOrg(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	timestamp:= time.Now()
	num, err := strconv.Atoi(args[2])
	var consent= Consent{Id:token.Id+"a" ,TokenId:token.Id ,Owner:token.Creator ,Requestor:args[1] ,NumAuthCall:num ,Timestamp:timestamp, ToOrg:true }
	consentAsBytes, _ := json.Marshal(consent)
	APIstub.PutState(consent.Id,consentAsBytes)
	return shim.Success(consentAsBytes)
}




// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
