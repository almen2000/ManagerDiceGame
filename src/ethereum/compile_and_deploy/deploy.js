const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const DiceGame = require('../build/DiceGame.json');
const fs = require('fs');

const provider = new HDWalletProvider(
  'ride van lion tenant ivory diagram assume lazy tomato orphan proud oppose',
  'https://rinkeby.infura.io/v3/a8bc12d19ee2426eba8ab41aedce8f10'
);
const web3 = new Web3(provider);

const deploy = async (minimumBet, maximumBet) => {
  const accounts = await web3.eth.getAccounts();
  
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(DiceGame.abi)
     .deploy({ data: '0x' + DiceGame.evm.bytecode.object, arguments: [minimumBet, maximumBet] }) // add 0x bytecode
     .send({ from: accounts[0] }); // remove 'gas'

  console.log('Contract deployed to', result.options.address);
  let addressesObject = {
    managerAddress: accounts[0],
    contractAddress: result.options.address
  };

  fs.writeFileSync('../addresses/addresses.json', JSON.stringify(addressesObject));
  process.exit();
};

deploy('100', '1000000000');
