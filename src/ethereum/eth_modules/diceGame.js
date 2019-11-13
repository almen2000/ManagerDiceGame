import web3 from './web3';
import DiceGame from '../build/DiceGame.json';
import getContractAddress from './contractAddress';

let contractAddress = getContractAddress();

const instance = new web3.eth.Contract(
  DiceGame.abi,
  contractAddress
);

export default instance;
