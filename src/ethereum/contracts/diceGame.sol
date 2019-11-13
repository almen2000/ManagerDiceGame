pragma solidity ^0.5.12;

contract DiceGame {
    address public manager;
    uint public gameId;
    uint public nextGameMinimumBet;
    uint public nextGameMaximumBet;
    uint public prevGameStartTime;
    uint private mustHaveBalance = 0;

    struct Player {
        bytes32 playerHash;
        uint betValue;
        bool received;
    }

    struct Game {
        mapping(address => Player) player;
        address payable[] playerAddresses;
        uint8 dice1;
        uint8 dice2;
        uint gameBalance;
        uint restBalance;
        uint minimumBet;
        uint maximumBet;
        bool gameCrashed;
    }

    mapping(uint => Game) game;

    // Function caller is manager
    modifier isManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    // Given dices are between 1 and 6
    modifier between1and6(uint8 dice1, uint8 dice2) {
        require(dice1 >= 1 && dice1 <= 6 && dice2 >= 1 && dice2 <= 6, "One of the dices are not between 1 and 6");
        _;
    }

    // Is possible to change minimum or maximum bet
    modifier canSetMinOrMaxBet(uint _minimumBet, uint _maximumBet) {
        require(_minimumBet <= _maximumBet, "You cannot set bet because maximumBet is less than minimumBet");
        _;
    }

    // Game constructor
    constructor(uint _minimumBet, uint _maximumBet) public canSetMinOrMaxBet(_minimumBet, _maximumBet) {
        gameId = 1;
        manager = msg.sender;
        game[gameId].minimumBet = _minimumBet;
        game[gameId].maximumBet = _maximumBet;
        nextGameMinimumBet = _minimumBet;
        nextGameMaximumBet = _maximumBet;
        prevGameStartTime = now;
    }

    // Transfer required money to manager if it is possible
    function transferMoneyToServer(uint _money) isManager external {
        require(address(this).balance > mustHaveBalance, "Contract balance is not more than must have balance");
        require(_money <= address(this).balance - mustHaveBalance, "Money is more than can be transferred");
        msg.sender.transfer(_money);
    }

    // Transfer all balance that is possible to manager
    function getAllRequiredMoney() isManager external {
        require(address(this).balance > mustHaveBalance, "Contract balance is not more than must have balance");
        msg.sender.transfer(address(this).balance - mustHaveBalance);
    }

    // Create new game
    function newGame(uint8 dice1, uint8 dice2) external isManager between1and6(dice1, dice2) {
        require(now - prevGameStartTime > 90, "Game started very fast");
        if (!game[gameId].gameCrashed) {
            game[gameId].dice1 = dice1;
            game[gameId].dice2 = dice2;
            game[gameId].restBalance = game[gameId].gameBalance;
        }
        gameId++;
        game[gameId].minimumBet = nextGameMinimumBet;
        game[gameId].maximumBet = nextGameMaximumBet;
        if (gameId > 4) mustHaveBalance -= game[gameId - 4].restBalance * 3 / 2;
        prevGameStartTime = now;
    }

    // Function set user bet value and hashed value if it possible
    function setUserBetAndHash(bytes32 playerHash) external payable {
        address payable playerAddress = msg.sender;
        require(address(this).balance >= mustHaveBalance + msg.value * 3 / 2, "The contract does not have enough money");
        require(playerAddress != manager, "Manager cannot bet a value");
        require(game[gameId].player[playerAddress].playerHash == 0, "Player already bet number");
        require(msg.value >= game[gameId].minimumBet, "Player bet less then minimumBet");
        require(msg.value <= game[gameId].maximumBet, "Player bet more then maximumBet");
        game[gameId].player[playerAddress].playerHash = playerHash;
        game[gameId].player[playerAddress].betValue = msg.value;
        game[gameId].playerAddresses.push(playerAddress);
        game[gameId].gameBalance += msg.value;
        mustHaveBalance += msg.value * 3 / 2;
    }

    // Transfer money to the player if player is winner
    function receiveMoney(uint _gameId, string memory password) public {
        if (gameId > 3) require(_gameId >= gameId - 3, "You cannot receive money from the game which ended more than 3 game ago");
        require(_gameId < gameId, "The game not ended");
        require(!game[_gameId].gameCrashed, "Game was crashed and players already receive a money");
        require(!game[_gameId].player[msg.sender].received, "Player already receive a money");
        bytes32 playerHash = hashPlayerBet(game[_gameId].dice1, game[_gameId].dice2, password);
        require(playerHash == game[_gameId].player[msg.sender].playerHash, "You are not winner or password is not correct");
        uint bet = game[_gameId].player[msg.sender].betValue;
        uint money = bet * 3 / 2;
        msg.sender.transfer(money);
        game[_gameId].restBalance -= bet;
        mustHaveBalance -= money;
        game[_gameId].player[msg.sender].received = true;
    }

    // Return players money if game crashed
    function forceReceiveMoney() external {
        require(now - prevGameStartTime > 30 minutes, "You can force receive money only after 30 minutes of previous game");
        require(!game[gameId].gameCrashed, "Game was crashed and players already receive a money");
        game[gameId].gameCrashed = true;
        address payable[] storage addresses = game[gameId].playerAddresses;
        uint length = addresses.length;
        for (uint _i = 0; _i < length; _i++) {
            addresses[_i].transfer(game[gameId].player[addresses[_i]].betValue);
            game[gameId].player[addresses[_i]].received = true;
        }
        mustHaveBalance -= game[gameId].gameBalance;
    }

    // Join dice1, dice2, password to one string and hash the string
    function hashPlayerBet(uint8 dice1, uint8 dice2, string memory password) private pure returns (bytes32) {
        bytes memory _password = bytes(password);
        uint length = _password.length;
        bytes memory strToHash = new bytes(length + 2);
        for (uint8 _i = 0; _i < length; _i++) strToHash[_i] = _password[_i];
        strToHash[length] = byte(48 + dice1);
        strToHash[length + 1] = byte(48 + dice2);
        return keccak256(strToHash);
    }

    // Set next game minimum bet
    function setNextGameMinimumBet(uint _nextGameMinimumBet) external isManager canSetMinOrMaxBet(_nextGameMinimumBet, nextGameMaximumBet) {
        nextGameMinimumBet = _nextGameMinimumBet;
    }

    // Set next game maximum bet
    function setNextGameMaximumBet(uint _nextGameMaximumBet) external isManager canSetMinOrMaxBet(nextGameMinimumBet, _nextGameMaximumBet) {
        nextGameMaximumBet = _nextGameMaximumBet;
    }

    // Return amount of contract balance
    function getContractBalance() external view isManager returns (uint) {
        return address(this).balance;
    }

    // Get must have balance
    function getMustHaveBalance() external view isManager returns (uint) {
        return mustHaveBalance;
    }

    // Contract need to transfer him money
    function needTransferMoney() external view isManager returns (bool) {
        return address(this).balance - mustHaveBalance < game[gameId].maximumBet * 3 / 2;
    }

    // Returns game parameters by ID
    function getGameById(uint id) external view returns (uint, uint, uint, uint, uint, uint, bool) {
        require(id >= 1, "Game id cannot be 0");
        require(id <= gameId, "Game not started");
        return (
            game[id].dice1,
            game[id].dice2,
            game[id].minimumBet,
            game[id].maximumBet,
            game[id].gameBalance,
            game[id].restBalance,
            game[id].gameCrashed
        );
    }

    // Function for sending Ether to a contract
    function() external payable {}
}