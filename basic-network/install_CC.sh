
#Start CLI
docker-compose -f ./docker-compose.yml up -d cli

#install CC on peer0.org1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp" cli peer chaincode install -n fabcar -v 1.0 -p github.com//fabcar/go

#Instantiate CC on peer0.org1
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -v 1.0 -c '{"Args":["Init"]}' 

#install CC on peer0.GDPR
docker exec -e "CORE_PEER_LOCALMSPID=GDPRMSP" -e "CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/peers/peer0.HelmoOrg.com/tls/server.crt" -e "CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/peers/peer0.GDPR.com/tls/server.key" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/peers/peer0.GDPR.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/users/Admin@GDPR.com/msp" -e "CORE_PEER_ADDRESS=peer0.GDPR.com:7051" cli peer chaincode install -n fabcar -v 1.0 -p github.com/fabcar/go

#Instantiate CC peer0.GDPR
docker exec -e "CORE_PEER_LOCALMSPID=GDPRMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/users/Admin@GDPR.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -v 1.0 -c '{"Args":["Init"]}' -P "OR ('Org1MSP.member','GDPRMSP.member')"

#install CC on peer0.Org2
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/peers/peer0.org2.com/tls/server.crt" -e "CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDorg2PR.com/peers/peer0.org2.com/tls/server.key" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/peers/peer0.org2.com/tls/ca.crt" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/Admin@org2.com/msp" -e "CORE_PEER_ADDRESS=peer0.org2.com:7051" cli peer chaincode install -n fabcar -v 1.0 -p github.com/fabcar/go

#Instantiate CC peer0.Org2
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/Admin@org2.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -v 1.0 -c '{"Args":["Init"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 10

#query the ledger from peer0.org1
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp" cli peer chaincode query -C mychannel -n fabcar -c '{"Args":["balance","{\"user\": \"Admin@org1.com\"}"]}'

#query the ledger from peer0.GDPR
#docker exec -e "CORE_PEER_LOCALMSPID=GDPRMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/GDPR.com/users/Admin@GDPR.com/msp" cli peer chaincode query -C mychannel -n fabcar -c '{"Args":["balance","{\"user\": \"Admin@GDPR.com\"}"]}'

#query the ledger from peer0.org1
#docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/Admin@org2.com/msp" cli peer chaincode query -C mychannel -n fabcar -c '{"Args":["balance","{\"user\": \"Admin@org2.com\"}"]}'

