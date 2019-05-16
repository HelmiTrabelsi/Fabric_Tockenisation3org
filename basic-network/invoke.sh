#invoke CreateToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["CreateToken","this is user Data"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User2@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["CreateToken","this is user Data"]}'

#invoke GetToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GetToken","1LByJ6D1VAZLQ9WaGrw9MNKxrkx"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User2@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["GetToken","1LBvb3EMQ14JK1bO4HwnOjkFNSK"]}'

#invoke deleteToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["deleteToken","1LBlky9isQM6Y70I9J8OO8PTbaP"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["deleteToken","1LBlky9isQM6Y70I9J8OO8PTbaP"]}'

#Give Consent
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GiveConsent","1LBtXjDxWX8yRnjXhlfbY1xHCzc","User1@org2.com","2"]}'

#invoke CreateTokenFromOther
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User2@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["CreateTokenFromOther","1LByJ6D1VAZLQ9WaGrw9MNKxrkx"]}'

#invoke GiveConsentToOrg

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GiveConsentToOrg","1LByJ6D1VAZLQ9WaGrw9MNKxrkx","Org2MSP","2"]}'


