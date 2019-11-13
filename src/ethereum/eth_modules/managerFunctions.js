import Web3, {providers} from 'web3';
import DiceGame from '../build/DiceGame.json';
import getContractAddress from './contractAddress';

let provider = new providers.HttpProvider('https://rinkeby.infura.io/v3/a8bc12d19ee2426eba8ab41aedce8f10');

const web3 = new Web3(provider);

let privateKey = '0x0CDC9A772C15F9409B328B0119A5486D15F2312E65F28C387C4D9BEAF17AE674';
let contractAddress = getContractAddress();
let contract = new web3.eth.Contract(
    DiceGame.abi,
    contractAddress
);

const signAndSendTransaction = async (senderPrivateKey, to, encodeABI, gas) => {
    let pk = senderPrivateKey;
    if ('0x' !== pk.slice(0, 2)) {
        pk = '0x' + pk;
    }

    let acc = web3.eth.accounts.privateKeyToAccount(pk);

    const transaction = {
        from: acc.address,
        to: to,
        gas: gas,
        data: encodeABI
    };

    let signed = await web3.eth.accounts.signTransaction(transaction, pk);
    let trn = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return trn;
};

const send = async (tr) => {
    return await signAndSendTransaction(privateKey, contractAddress, tr.encodeABI(), 300000);
};

export async function newGame(dice1, dice2) {
    if (dice1 < 1 || dice1 > 6 || dice2 < 1 || dice2 > 6) return false;
    const tr = contract.methods.newGame(dice1, dice2);
    return await send(tr);
}

export async function transferMoneyToServer(money) {
    if (Number(money) < 0) return false;
    const tr = contract.methods.transferMoneyToServer(money);
    return await send(tr);
}

export async function getAllRequiredMoney() {
    const tr = contract.methods.getAllRequiredMoney();
    return await send(tr);
}

export async function setNextGameMinimumBet(nextGameMinimumBet) {
    const tr = contract.methods.setNextGameMinimumBet(nextGameMinimumBet);
    return await send(tr);
}

export async function setNextGameMaximumBet(nextGameMaximumBet) {
    const tr = contract.methods.setNextGameMaximumBet(nextGameMaximumBet);
    return await send(tr);
}

export default {newGame, transferMoneyToServer, getAllRequiredMoney, setNextGameMinimumBet, setNextGameMaximumBet}
