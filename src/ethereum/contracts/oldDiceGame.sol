pragma solidity ^0.5.12;

contract DiceGame {
    address public manager;
    uint public gameId;
    uint public nextGameMinimumBet;

    struct Player {
        bytes32 hashValue;
        uint betValue;
        bool received;
    }

    struct Game {
        mapping(address => Player) players;
        address[] playerAddresses;
        uint8 winningValue;
        uint winnerCount;
        uint allWinnersBalance;
        uint restBalance;
        uint gameBalance;
        uint minimumBet;
    }

    mapping(uint => Game) games;

    modifier between2and12(uint value) {
        require(value >= 2 && value <= 12, "The number is not from 2 to 12");
        _;
    }

    modifier isManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    constructor(uint _minimumBet) public {
        games[0].minimumBet = _minimumBet;
        nextGameMinimumBet = _minimumBet;
        manager = msg.sender;
        gameId = 1;
    }

    function setUserBetAndHash(bytes32 hashValue) public payable {
        address senderAddress = msg.sender;
        require(senderAddress != manager, "Manager cannot bet a value");
        require(games[gameId].players[senderAddress].hashValue == 0, "Player already bet number");
        require(msg.value >= games[gameId].minimumBet, "You Bet less then minimumBet");
        games[gameId].players[senderAddress].hashValue = hashValue;
        games[gameId].players[senderAddress].betValue = msg.value;
        games[gameId].playerAddresses.push(senderAddress);
        games[gameId].gameBalance += msg.value;
    }

    function checkUserValue(uint8 userValue, uint _gameId) private view between2and12(userValue) returns (bool) {
        require(!games[_gameId].players[msg.sender].received, "Player already receive a money");
        require(_gameId >= 0 && _gameId < gameId, "Game is not ended");
        require(userValue == games[_gameId].winningValue, "User input does not match winning value");
        bytes32 userHash = keccak256(abi.encode(userValue));
        require(userHash == games[_gameId].players[msg.sender].hashValue, "User input does not match its hash");
        return true;
    }

    function receiveMoney(uint8 userValue, uint _gameId) public payable {
        require(checkUserValue(userValue, _gameId));
        uint money = games[_gameId].players[msg.sender].betValue * games[_gameId].gameBalance / games[_gameId].allWinnersBalance;
        msg.sender.transfer(money);
        games[_gameId].restBalance -= money;
        games[_gameId].players[msg.sender].received = true;
    }

    function setServerValue(uint8 dice) private between2and12(dice) {
        games[gameId].winningValue = dice;
    }

    function setGame() private {
        address[] storage gamePlayerAddresses = games[gameId].playerAddresses;
        uint length = gamePlayerAddresses.length;

        for (uint i = 0; i < length; i++) {
            bytes32 playerHash = games[gameId].players[gamePlayerAddresses[i]].hashValue;
            if (playerHash == keccak256(abi.encode(games[gameId].winningValue))) {
                games[gameId].winnerCount++;
                games[gameId].allWinnersBalance += games[gameId].players[gamePlayerAddresses[i]].betValue;
            }
        }

        games[gameId].restBalance = games[gameId].gameBalance;
    }

    function setMinimumBet(uint _nextGameMinimumBet) public isManager {
        nextGameMinimumBet = _nextGameMinimumBet;
    }

    function newGame(uint8 dice) public isManager returns (bool) {
        setServerValue(dice);
        setGame();
        gameId++;
        games[gameId].minimumBet = nextGameMinimumBet;
        return true;
    }

    function getGameById(uint id) public view returns (uint8 winningValue, uint restBalance, uint gameBalance, uint minimumBet) {
        return (
            games[id].winningValue,
            games[id].restBalance,
            games[id].gameBalance,
            games[id].minimumBet
        );
    }
}