const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.join(__dirname, '../build');
console.log(buildPath);

fs.removeSync(buildPath);

const diceGamePath = path.join(__dirname, '../contracts', 'diceGame.sol');
const source = fs.readFileSync(diceGamePath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'diceGame.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': [ '*' ],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts['diceGame.sol'];

fs.ensureDirSync(buildPath);

const contract = contracts.DiceGame;

fs.outputJsonSync(path.resolve(buildPath, 'DiceGame.json'), contract);
