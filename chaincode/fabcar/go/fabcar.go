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
	"encoding/json"
	"fmt"
	//"errors"
	"strconv"
	"time"
	"github.com/segmentio/ksuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"crypto/sha256"
	"encoding/base64"
	//"github.com/hyperledger/fabric/core/chaincode/lib/cid"
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
	} else if function == "AddInput" {
		return s.AddInput(APIstub, args)
	} else if function == "FinalizeToken" {
		return s.FinalizeToken(APIstub, args)
	}else if function == "RemoveInput" {
		return s.RemoveInput(APIstub, args)
	} else if function == "SetAuthCall" {
		return s.SetAuthCall(APIstub, args)
	}
	

	

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) CreateToken(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	timestamp:= time.Now()
	id := ksuid.New().String()
	owner, err := CallerCN(APIstub)
	if err != nil {
		return shim.Error("Error getting from owner")
	}
	output:=[]string{}
	input:=[]string{}
	finalized, _ := strconv.ParseBool(args[1])
	var token= Token{Id:id,Creator:owner, Data:args[0], Creation_date:timestamp,Output:output,Finalized:finalized,Input:input}

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
	data:=args[0]
	caller , _ :=CallerCN(APIstub)
	//create Hash
	hasher:=id+timestamp.String()+caller
	hash := sha256.New()
    hash.Write([]byte (hasher))
	sha := base64.URLEncoding.EncodeToString(hash.Sum(nil))
	finalized, _ := strconv.ParseBool(args[1])
	var token= Token{Id:id,Creator:caller, Data:data, Creation_date:timestamp,Hash:sha,Finalized:finalized }	
	var consent Consent
	
	
	
	for  i:=2;i<len(args); i++{
		token1,_:= get_token(APIstub, args[i])
		_,err:=is_it_auth (APIstub,args[i])
		if err !=nil{
			return shim.Error(fmt.Sprintf("Error: ",err))
		}else if !token1.Finalized{
			return shim.Error("This Token is not Finalized")
		}else {
			consent,_= get_consent(APIstub, args[i]+"a")
			update_auth_call(APIstub, consent.Id) 
			

			data=data+" "+token1.Creator
			token1.Output=append(token1.Output,id)
			token.Input=append(token.Input,args[i])
			tokenAsBytes1, _ := json.Marshal(token1)
			APIstub.PutState(token1.Id,tokenAsBytes1 )

		}
	}
	tokenAsBytes, _ := json.Marshal(token)
	APIstub.PutState(token.Id,tokenAsBytes)
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
	

	_,err=is_it_auth (APIstub,token.Id)
	if err !=nil{
		return shim.Error(fmt.Sprintf("Error: ",err))
	} else {
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
	IDAsBytes, _ := json.Marshal(token.Id)
	return shim.Success(IDAsBytes)
}

func (s *SmartContract) GiveConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	invoker, err :=CallerCN(APIstub)
	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	if invoker==token.Creator{

		timestamp:= time.Now()
		num, _ := strconv.Atoi(args[2])
		var consent= Consent{Id:token.Id+"a" ,TokenId:token.Id ,Owner:token.Creator ,Requestor:args[1] ,NumAuthCall:num ,Timestamp:timestamp, ToOrg:false }
		consentAsBytes, _ := json.Marshal(consent)
		APIstub.PutState(consent.Id,consentAsBytes)
		return shim.Success(consentAsBytes)
	} else {
		return shim.Error("This user is not the owner of this token")
	}
}

func (s *SmartContract) GiveConsentToOrg(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	invoker, err :=CallerCN(APIstub)
	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	if invoker==token.Creator{
		timestamp:= time.Now()
		num, _ := strconv.Atoi(args[2])
		var consent= Consent{Id:token.Id+"a" ,TokenId:token.Id ,Owner:token.Creator ,Requestor:args[1] ,NumAuthCall:num ,Timestamp:timestamp, ToOrg:true }
		consentAsBytes, _ := json.Marshal(consent)
		APIstub.PutState(consent.Id,consentAsBytes)
		return shim.Success(consentAsBytes)
	} else {
		return shim.Error("This user is not the owner of this token")
	}
}

func (s *SmartContract) AddInput(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	caller , _ :=CallerCN(APIstub)

	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}

	
	for  i:=1;i<len(args); i++{
		token2,err :=get_token(APIstub, args[i])
		if err != nil {
			return shim.Error("Token not found")
		}
		_,err=is_it_auth (APIstub,token2.Id)
		if err !=nil || caller!=token.Creator {
			return shim.Error(fmt.Sprintf("Error: ",err))
		}else if token.Finalized{ 	 
			err:="This token is finalized  "
			return shim.Error(fmt.Sprintf("Error: ",err))
		}
		 else {
			token2.Output=append(token2.Output,token.Id)
			token.Input=append(token.Input,token2.Id)
			token.Data=token.Data+" "+token2.Data 
			tokenAsBytes, _ := json.Marshal(token)
			token2AsBytes, _ := json.Marshal(token2)
			APIstub.PutState(token.Id,tokenAsBytes )
			APIstub.PutState(token2.Id,token2AsBytes)
			return shim.Success(tokenAsBytes)
		}
	}
	tokenAsBytes, _ := json.Marshal(token)
	return shim.Success(tokenAsBytes)
}

func (s *SmartContract) FinalizeToken(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	invoker, err :=CallerCN(APIstub)
	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	if invoker==token.Creator{
		token.Finalized=true
		tokenAsBytes, _ := json.Marshal(token)
		APIstub.PutState(token.Id,tokenAsBytes)
		return shim.Success(tokenAsBytes)
	} else {
		return shim.Error("This user is not the owner of this token")
	}
}

func (s *SmartContract) RemoveInput(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	caller , _ :=CallerCN(APIstub)

	token,err :=get_token(APIstub, args[0])
	if err != nil {
		return shim.Error("Token not found")
	}
	token2,err :=get_token(APIstub, args[1])
	if err != nil {
		return shim.Error("Token not found")
	}

	_,err=is_it_auth (APIstub,token2.Id)
		if err !=nil || caller!=token.Creator{
			return shim.Error(fmt.Sprintf("Error: ",err))
		} else if token.Finalized{ 	 
			err:="This token is finalized "
			return shim.Error(fmt.Sprintf("Error: ",err))
		}
		else {
			IndexToRemove:=indexOf(args[1],token.Input)
			token2.Output=RemoveIndex(token2.Output, IndexToRemove)
			token.Input= RemoveIndex(token.Input, IndexToRemove)	
			tokenAsBytes, _ := json.Marshal(token)
			token2AsBytes, _ := json.Marshal(token2)
			APIstub.PutState(token.Id,tokenAsBytes )
			APIstub.PutState(token2.Id,token2AsBytes)
			return shim.Success(tokenAsBytes)
		}
	
	tokenAsBytes, _ := json.Marshal(token)
	return shim.Success(tokenAsBytes)
}

func (s *SmartContract) SetAuthCall(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	consent,err :=get_consent(APIstub, args[0]+"a")
	if err != nil {
		return shim.Error("Consent not found")
	}
	consent.NumAuthCall,_=strconv.Atoi(args[1])
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


