import React from 'react';
import './App.css';
import GetBalance from "./components/getContractBalance";
import GetMustHaveBalance from "./components/getMustHaveBalance";
import NeedMoney from "./components/needTransferMoney";
import GetAllMoney from "./components/getAllMoneyFromServer";
import GetMoneyFromServer from "./components/getMoneyFromServer";
import SetNextGameMaximumBet from "./components/setNextGameMaximumBet";
import SetNextGameMinimumBet from "./components/setNextGameMinimuBet";
import NewGame from "./components/setNewGame";
import GameId from "./components/getGameId";

function App() {
    return (
        <div>
            <GameId/>
            <GetBalance/>
            <GetMustHaveBalance/>
            <NeedMoney/>
            <GetAllMoney/>
            <GetMoneyFromServer/>
            <SetNextGameMaximumBet/>
            <SetNextGameMinimumBet/>
            <NewGame/>
        </div>
    );
}

export default App;
