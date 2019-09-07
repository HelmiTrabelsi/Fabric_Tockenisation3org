//SPDX-License-Identifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http')
var fs = require('fs');
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
const { FileSystemWallet, Gateway ,X509WalletMixin} = require('fabric-network');
const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

function myFunction(user,password) {
	const walletPath = path.join(process.cwd(), 'wallet');
	fs.readFile(`${walletPath}/${user}/${user}`, (err, data) => { 
		if (err) throw err; 
	
		  
		// In case of a error throw err. 
		if (err) throw err; 
		JsonData=JSON.parse(data.toString())
		//secret=JsonData.enrollmentSecret
		JsonData.enrollmentSecret=password
	
		console.log(JSON.stringify(JsonData)); 
		//fs.writeFile('/home/helmi/Fabric_Tockenisation(3org)/basic-network/javascript/wallet/aaa/aaa', JSON.stringify(JsonData), (err) => { 
		fs.writeFile(`${walletPath}/${user}/${user}`, JSON.stringify(JsonData), (err) => { 
			// In case of a error throw err. 
		if (err) throw err; 
	}) 
	})
  }
module.exports = (function () {
	return {
		RegisterUser: async function (req, res) {
			//try {
				var array = req.params.user.split("-");
				var user = array[0]
				var password = array[1].toString()
				var Org = array[2].toString()
				console.log("Registring User: ");
				//console.log(user)
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (userExists) {
					console.log("An identity for the user " + user + " already exists in the wallet");
					return;
				}

				// Check to see if we've already enrolled the admin user.
				const adminExists = await wallet.exists('admin');
				if (!adminExists) {
					console.log('An identity for the admin user "admin" does not exist in the wallet');
					console.log('Run the enrollAdmin.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

				// Get the CA client object from the gateway for interacting with the CA.
				const ca = gateway.getClient().getCertificateAuthority();
				const adminIdentity = gateway.getCurrentIdentity();

				// Register the user, enroll the user, and import the new identity into the wallet.
				const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: user, role: 'client' }, adminIdentity);
				console.log(secret)
				const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret })
				//const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
				//console.log(secret)
				const userIdentity = X509WalletMixin.createIdentity(Org, enrollment.certificate, enrollment.key.toBytes());
				//console.log(userIdentity)
				wallet.import(user, userIdentity);
				//fs.readFile('/home/helmi/Fabric_Tockenisation(3org)/basic-network/javascript/wallet/aaa/aaa', (err, data) => { 

				console.log(`Successfully registered and enrolled admin user ${user} and imported it into the wallet`);
				res.send(`Successfully registered and enrolled admin user ${user} and imported it into the wallet`)
				setTimeout(function () {
					myFunction(user,password);
				}, 1000);

		},

		

		SignInUser: async function (req, res) {
			try {
				console.log("Singn in User: ");
				var array = req.params.user.split("-");
				var user = array[0]
				var password = array[1]
				var mspid = array[2]
				//console.log(user)
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the CA client object from the gateway for interacting with the CA.
				const Client = gateway.getClient()
				console.log(Client._userContext._identity._mspId)
				console.log(Client._userContext._name)
				console.log(Client._userContext._enrollmentSecret)
				//console.log(Client)
				var _mspid = Client._userContext._identity._mspId
				var _name = Client._userContext._name
				var _secret = Client._userContext._enrollmentSecret
				if (_mspid!=mspid || _name!=user || _secret!=password ){
					res.send("Failed to sign In this user ")
				}
				else res.send("Good")


			} catch (error) {
				console.error(`Failed to register user ${user}: ${error}`);

			}
		},

		



		CreateToken: async function (req, res) {
			console.log("Creating Token: ");
			var array = req.params.token.split("-");
			var user = array[0]
			console.log(user)
			var data = array[1]
			var finalized = array[2]
			

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				console.log(finalized)
				
				const result = await contract.submitTransaction('CreateToken', data, finalized);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}, txid`);
				
				res.send(result)
				return (result)


			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		CreateTokenFromOther: async function (req, res) {
			console.log("Creating Token from another token: ");
			var array = req.params.token.split("-");
			var user = array[0]
			var finalized = array[1]
			var data = array[2]
			var Token1=array[3].toString()
			if (array[4]!=undefined){
				var Token2=array[4].toString()
			}
			if (array[5]!=undefined){
				var Token3=array[5].toString()
			}
			if (array[6]!=undefined){
				var Token4=array[6].toString()
			}
			if (array[7]!=undefined){
				var Token5=array[7].toString()
			}		
			console.log(finalized)
			
		
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')

				//const result = await contract.submitTransaction('CreateTokenFromOther', finalized, Token1,Token2,Token3);
				var result=''
				if (array[4]==undefined){
					 result = await contract.submitTransaction('CreateTokenFromOther', data,finalized, Token1);
				} 
				else if (array[5]==undefined){
					 result = await contract.submitTransaction('CreateTokenFromOther',  data,finalized, Token1,Token2);
				}
				else if (array[6]==undefined){
					result = await contract.submitTransaction('CreateTokenFromOther',  data,finalized, Token1,Token2,Token3);
				}
				else if (array[7]==undefined){
					result = await contract.submitTransaction('CreateTokenFromOther',  data,finalized, Token1,Token2,Token3,Token4);
				}else {
					result = await contract.submitTransaction('CreateTokenFromOther',  data,finalized, Token1,Token2,Token3,Token4,Token5);
				}
	
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		GiveConsent: async function (req, res) {
			console.log("Giving Consent: ");
			var array = req.params.data.split("-");
			var user = array[0]
			console.log(user)
			var id = array[1]
			var user2=array[2]
			var num=array[3]
			console.log(id)
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log(`An identity for the user ${user} does not exist in the wallet`);
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('GiveConsent', id, user2,num);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		GiveConsentToOrg: async function (req, res) {
			console.log("Giving Consent to an organisation: ");
			var array = req.params.data.split("-");
			var user = array[0]
			var id = array[1]
			var org=array[2]
			var num=array[3]
			console.log(id)
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('GiveConsentToOrg', id, org,num);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		GetToken: async function (req, res) {
			console.log("getting token: ");
			var array = req.params.id.split("-");
			var user = array[0]
			var id = array[1]
			console.log(id)
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.evaluateTransaction('GetToken', id);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},



		deleteToken: async function (req, res) {
			console.log("Delete Token");
			var array = req.params.id.split("-");
			var user = array[0]
			var id = array[1]

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('deleteToken', id);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},


		AddInput: async function (req, res) {
			console.log("Add Input to token: ");
			var array = req.params.token.split("-");
			var user = array[0]
			//var tokenList=array[1].toString()
			var token1=array[1].toString()
			var token2=array[2].toString()

			/*for (var i = 2; i < array.length; i++) {
				token = array[i].toString()
				tokenList = tokenList + "," + token
			}*/
			
			console.log(token1,token2)

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('AddInput',token1,token2);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		RemoveInput: async function (req, res) {
			console.log("Remove Input to token: ");
			var array = req.params.token.split("-");
			var user = array[0]
			//var tokenList=array[1].toString()
			var token1=array[1].toString()
			var token2=array[2].toString()

			/*for (var i = 2; i < array.length; i++) {
				token = array[i].toString()
				tokenList = tokenList + "," + token
			}*/
			
			console.log(token1,token2)

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('RemoveInput',token1,token2);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		FinalizeToken: async function (req, res) {
			console.log("Finalize Token");
			var array = req.params.id.split("-");
			var user = array[0]
			var id = array[1]

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('FinalizeToken', id);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},

		SetAuthCall: async function (req, res) {
			console.log("Setting Authorized call:");
			var array = req.params.token.split("-");
			var user = array[0]
			//var tokenList=array[1].toString()
			var token1=array[1].toString()
			var number=array[2]

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists(user);
				if (!userExists) {
					console.log('An identity for the user user does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('SetAuthCall',token1,number);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
				res.send(result)
				return (result)

			} catch (error) {
				console.error(`Failed to evaluate transaction: ${error}`);
				//process.exit(1);
			}
		},


	}
})();
