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

module.exports = (function () {
	return {
		CreateToken: async function (req, res) {
			console.log("Creating Token: ");
			var array = req.params.token.split("-");
			var data = array[0]
			var finalized = array[1]
			

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				console.log(finalized)
				const result = await contract.submitTransaction('CreateToken', data, finalized);
				console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
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
			var finalized = array[0]
			var tokenList=array[1].toString()
			for (var i = 2; i < array.length; i++) {
				token = array[i].toString()
				tokenList = tokenList + "," + token
			}
			console.log(finalized)
			console.log(tokenList)

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('CreateTokenFromOther', finalized, tokenList);
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
			var id = array[0]
			var user=array[1]
			var num=array[2]
			console.log(id)
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('GiveConsent', id, user,num);
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
			var id = array[0]
			var org=array[1]
			var num=array[2]
			console.log(id)
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

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
			var id = req.params.id
			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

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
			var id = req.params.id;

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

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
			console.log("Creating Token from another token: ");
			var array = req.params.token.split("-");
			var tokenList=array[0].toString()
			for (var i = 2; i < array.length; i++) {
				token = array[i].toString()
				tokenList = tokenList + "," + token
			}


			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

				// Get the network (channel) our contract is deployed to.
				const network = await gateway.getNetwork('mychannel');

				// Get the contract from the network.
				const contract = network.getContract('fabcar');

				// Evaluate the specified transaction.
				// queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
				// queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
				const result = await contract.submitTransaction('CreateTokenFromOther',tokenList);
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
			var id = req.params.id;

			try {
				// Create a new file system based wallet for managing identities.
				const walletPath = path.join(process.cwd(), 'wallet');
				const wallet = new FileSystemWallet(walletPath);
				console.log(`Wallet path: ${walletPath}`);

				// Check to see if we've already enrolled the user.
				const userExists = await wallet.exists('user1');
				if (!userExists) {
					console.log('An identity for the user "user1" does not exist in the wallet');
					console.log('Run the registerUser.js application before retrying');
					return;
				}

				// Create a new gateway for connecting to our peer node.
				const gateway = new Gateway();
				await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

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
	RegisterUser: async function(req, res) {
		try {
			console.log("Registring User: ");
			var user = req.params.user;
			console.log(user)
			// Create a new file system based wallet for managing identities.
			const walletPath = path.join(process.cwd(), 'wallet');
			const wallet = new FileSystemWallet(walletPath);
			console.log(`Wallet path: ${walletPath}`);
	
			// Check to see if we've already enrolled the user.
			const userExists = await wallet.exists(user);
			if (userExists) {
				console.log("An identity for the user "+ user +" already exists in the wallet");
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
			const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
			const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
			wallet.import(user, userIdentity);
			console.log(`Successfully registered and enrolled admin user ${user} and imported it into the wallet`);
			res.send(`Successfully registered and enrolled admin user ${user} and imported it into the wallet`)
		} catch (error) {
			console.error(`Failed to register user ${user}: ${error}`);
			
		}
	},
		get_Token: function (req, res) {

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '/fabric-samples-release-1.4/basic-network/javascript/wallet/user1');
			console.log('Store path:' + store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({
				path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// queryToken - requires 1 argument, ex: args: ['4'],
				const request = {
					chaincodeId: 'fabcar',
					txId: tx_id,
					fcn: 'balance',
					args: [key]
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
			}).then((query_responses) => {
				console.log("Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
					if (query_responses[0] instanceof Error) {
						console.error("error from query = ", query_responses[0]);
						res.send("Could not locate Token")

					} else {
						console.log("Response is ", query_responses[0].toString());
						res.send(query_responses[0].toString())
					}
				} else {
					console.log("No payloads were returned from query");
					res.send("Could not locate Token")
				}
			}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
				res.send("Could not locate Token")
			});
		},


		get_history: function (req, res) {

			var fabric_client = new Fabric_Client();
			var key = req.params.id

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);

			//
			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:' + store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({
				path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// queryToken - requires 1 argument, ex: args: ['4'],
				const request = {
					chaincodeId: 'Token-app',
					txId: tx_id,
					fcn: 'GetHistory',
					args: [key]
				};

				// send the query proposal to the peer
				return channel.queryByChaincode(request);
			}).then((query_responses) => {
				console.log("Query has completed, checking results");
				// query_responses could have more than one  results if there multiple peers were used as targets
				if (query_responses && query_responses.length == 1) {
					if (query_responses[0] instanceof Error) {
						console.error("error from query = ", query_responses[0]);
						res.send("Could not locate Token")

					} else {
						console.log("Response is ", query_responses[0].toString());
						res.send(query_responses[0].toString())
					}
				} else {
					console.log("No payloads were returned from query");
					res.send("Could not locate Token")
				}
			}).catch((err) => {
				console.error('Failed to query successfully :: ' + err);
				res.send("Could not locate Token")
			});
		},
		change_holder: function (req, res) {
			console.log("changing holder of Token catch: ");

			var array = req.params.holder.split("-");
			var key = array[0]
			var HolderHospital = array[1];

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:' + store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({
				path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// get a transaction id object based on the current user assigned to fabric client
				tx_id = fabric_client.newTransactionID();
				console.log("Assigning transaction_id: ", tx_id._transaction_id);

				// changeTokenHolder - requires 2 args , ex: args: ['1', 'Barry'],
				// send proposal to endorser
				var request = {
					//targets : --- letting this default to the peers assigned to the channel
					chaincodeId: 'Token-app',
					fcn: 'SendOrgan',
					args: [key, HolderHospital],
					chainId: 'mychannel',
					txId: tx_id
				};

				// send the transaction proposal to the peers
				return channel.sendTransactionProposal(request);
			}).then((results) => {
				var proposalResponses = results[0];
				var proposal = results[1];
				let isProposalGood = false;
				if (proposalResponses && proposalResponses[0].response &&
					proposalResponses[0].response.status === 200) {
					isProposalGood = true;
					console.log('Transaction proposal was good');
				} else {
					console.error('Transaction proposal was bad');
				}
				if (isProposalGood) {
					console.log(util.format(
						'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
						proposalResponses[0].response.status, proposalResponses[0].response.message));

					// build up the request for the orderer to have the transaction committed
					var request = {
						proposalResponses: proposalResponses,
						proposal: proposal
					};

					// set the transaction listener and set a timeout of 30 sec
					// if the transaction did not get committed within the timeout period,
					// report a TIMEOUT status
					var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
					var promises = [];

					var sendPromise = channel.sendTransaction(request);
					promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

					// get an eventhub once the fabric client has a user assigned. The user
					// is required bacause the event registration must be signed
					let event_hub = fabric_client.newEventHub();
					event_hub.setPeerAddr('grpc://localhost:7053');

					// using resolve the promise so that result status may be processed
					// under the then clause rather than having the catch clause process
					// the status
					let txPromise = new Promise((resolve, reject) => {
						let handle = setTimeout(() => {
							event_hub.disconnect();
							resolve({ event_status: 'TIMEOUT' }); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
						}, 3000);
						event_hub.connect();
						event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
							// this is the callback for transaction event status
							// first some clean up of event listener
							clearTimeout(handle);
							event_hub.unregisterTxEvent(transaction_id_string);
							event_hub.disconnect();

							// now let the application know what happened
							var return_status = { event_status: code, tx_id: transaction_id_string };
							if (code !== 'VALID') {
								console.error('The transaction was invalid, code = ' + code);
								resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
							} else {
								console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
								resolve(return_status);
							}
						}, (err) => {
							//this is the callback if something goes wrong with the event registration or processing
							reject(new Error('There was a problem with the eventhub ::' + err));
						});
					});
					promises.push(txPromise);

					return Promise.all(promises);
				} else {
					console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send("Error: no Token catch found");
					// throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
				}
			}).then((results) => {
				console.log('Send transaction promise and event listener promise have completed');
				// check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
					console.log('Successfully sent transaction to the orderer.');
					res.json(tx_id.getTransactionID())
				} else {
					console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send("Error: no Token catch found");
				}

				if (results && results[1] && results[1].event_status === 'VALID') {
					console.log('Successfully committed the change to the ledger by the peer');
					res.json(tx_id.getTransactionID())
				} else {
					console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
				}
			}).catch((err) => {
				console.error('Failed to invoke successfully :: ' + err);
				res.send("Error: no Token catch found");
			});

		},


		organ_as_used: function (req, res) {
			console.log("changing used of Token catch: ");

			var key = req.params.id

			var fabric_client = new Fabric_Client();

			// setup the fabric network
			var channel = fabric_client.newChannel('mychannel');
			var peer = fabric_client.newPeer('grpc://localhost:7051');
			channel.addPeer(peer);
			var order = fabric_client.newOrderer('grpc://localhost:7050')
			channel.addOrderer(order);

			var member_user = null;
			var store_path = path.join(os.homedir(), '.hfc-key-store');
			console.log('Store path:' + store_path);
			var tx_id = null;

			// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
			Fabric_Client.newDefaultKeyValueStore({
				path: store_path
			}).then((state_store) => {
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);

				// get the enrolled user from persistence, this user will sign all requests
				return fabric_client.getUserContext('user1', true);
			}).then((user_from_store) => {
				if (user_from_store && user_from_store.isEnrolled()) {
					console.log('Successfully loaded user1 from persistence');
					member_user = user_from_store;
				} else {
					throw new Error('Failed to get user1.... run registerUser.js');
				}

				// get a transaction id object based on the current user assigned to fabric client
				tx_id = fabric_client.newTransactionID();
				console.log("Assigning transaction_id: ", tx_id._transaction_id);

				// changeTokenHolder - requires 2 args , ex: args: ['1', 'Barry'],
				// send proposal to endorser
				var request = {
					//targets : --- letting this default to the peers assigned to the channel
					chaincodeId: 'Token-app',
					fcn: 'OrganAsUsed',
					args: [key],
					chainId: 'mychannel',
					txId: tx_id
				};

				// send the transaction proposal to the peers
				return channel.sendTransactionProposal(request);
			}).then((results) => {
				var proposalResponses = results[0];
				var proposal = results[1];
				let isProposalGood = false;
				if (proposalResponses && proposalResponses[0].response &&
					proposalResponses[0].response.status === 200) {
					isProposalGood = true;
					console.log('Transaction proposal was good');
				} else {
					console.error('Transaction proposal was bad');
				}
				if (isProposalGood) {
					console.log(util.format(
						'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
						proposalResponses[0].response.status, proposalResponses[0].response.message));

					// build up the request for the orderer to have the transaction committed
					var request = {
						proposalResponses: proposalResponses,
						proposal: proposal
					};

					// set the transaction listener and set a timeout of 30 sec
					// if the transaction did not get committed within the timeout period,
					// report a TIMEOUT status
					var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
					var promises = [];

					var sendPromise = channel.sendTransaction(request);
					promises.push(sendPromise); //we want the send transaction first, so that we know where to check status

					// get an eventhub once the fabric client has a user assigned. The user
					// is required bacause the event registration must be signed
					let event_hub = fabric_client.newEventHub();
					event_hub.setPeerAddr('grpc://localhost:7053');

					// using resolve the promise so that result status may be processed
					// under the then clause rather than having the catch clause process
					// the status
					let txPromise = new Promise((resolve, reject) => {
						let handle = setTimeout(() => {
							event_hub.disconnect();
							resolve({ event_status: 'TIMEOUT' }); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
						}, 3000);
						event_hub.connect();
						event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
							// this is the callback for transaction event status
							// first some clean up of event listener
							clearTimeout(handle);
							event_hub.unregisterTxEvent(transaction_id_string);
							event_hub.disconnect();

							// now let the application know what happened
							var return_status = { event_status: code, tx_id: transaction_id_string };
							if (code !== 'VALID') {
								console.error('The transaction was invalid, code = ' + code);
								resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
							} else {
								console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
								resolve(return_status);
							}
						}, (err) => {
							//this is the callback if something goes wrong with the event registration or processing
							reject(new Error('There was a problem with the eventhub ::' + err));
						});
					});
					promises.push(txPromise);

					return Promise.all(promises);
				} else {
					console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
					res.send("Error: no Token catch found");
					// throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
				}
			}).then((results) => {
				console.log('Send transaction promise and event listener promise have completed');
				// check the results in the order the promises were added to the promise all list
				if (results && results[0] && results[0].status === 'SUCCESS') {
					console.log('Successfully sent transaction to the orderer.');
					res.json(tx_id.getTransactionID())
				} else {
					console.error('Failed to order the transaction. Error code: ' + response.status);
					res.send("Error: no Token catch found");
				}

				if (results && results[1] && results[1].event_status === 'VALID') {
					console.log('Successfully committed the change to the ledger by the peer');
					res.json(tx_id.getTransactionID())
				} else {
					console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
				}
			}).catch((err) => {
				console.error('Failed to invoke successfully :: ' + err);
				res.send("Error: no Token catch found");
			});

		}

	}
})();
