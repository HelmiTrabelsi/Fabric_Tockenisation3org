#invoke CreateToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["CreateToken","this is user Data"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["CreateToken","this is user Data"]}'

#invoke GetToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GetToken","1Le3pui6hIRWlyFGB3Mr0A18mEj"]}'

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["GetToken","1Le3pui6hIRWlyFGB3Mr0A18mEj"]}'

#invoke deleteToken
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["deleteToken","1LBlky9isQM6Y70I9J8OO8PTbaP"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["deleteToken","1LBlky9isQM6Y70I9J8OO8PTbaP"]}'

#Give Consent
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GiveConsent","1LdpgnPbKHh97zzMAeWpw7JceFo","User1@org2.com","2"]}'

#invoke CreateTokenFromOther
docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["CreateTokenFromOther","1LdsZDbJ7OI99jO5nYfXjWpe57Z","1LdsZSjYHrUQVUU3UIxGaGGAIPv"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["CreateTokenFromOther","1Le3pQNPR37qIxIKuxcVgAPFnns","1Le3pui6hIRWlyFGB3Mr0A18mEj"]}'

#invoke GiveConsentToOrg

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["GiveConsentToOrg","1LdsZSjYHrUQVUU3UIxGaGGAIPv","Org2MSP","2"]}'

#Add Input

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.com/users/User1@org2.com/msp" cli peer chaincode invoke -C mychannel -o orderer.example.com:7050 -n fabcar -c '{"Args":["AddInput","1LdopH7QvNiGG4UpbO03vD4fgKj","1LdopXd22vkcpzKboA3S6sqihHb"]}'
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/User1@org1.com/msp" cli peer chaincode invoke -C mychannel -n fabcar -c '{"Args":["AddInput","1LdpVDKHO9jtXoNGyks5sNUpciJ","1LdpVSLin0Kp4vEVdvUe5l2rAeI"]}'


