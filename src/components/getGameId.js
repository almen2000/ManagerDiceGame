import React from 'react';
import diceGame from '../ethereum/eth_modules/diceGame';
import { Button } from 'semantic-ui-react';

class GameId extends React.Component {

    state = {
        gameId: null
    };

    getGameId = async () => {

        const gameId = Number(await diceGame.methods.gameId().call({ from: '0xCE2496baff9b404b9C8f5445B48bA92441ed6B33' }));
        this.setState({gameId});
    };

    render() {

        const style = {
            fontWeight: 'bold',
            fontSize: '21px',
            marginLeft: '25px'
        };

        const gameId = (this.state.gameId === null) ? '' : this.state.gameId.toString();

        return (
            <div>
                <Button onClick={this.getGameId}>Get Game Id</Button>
                <span style={style}>{gameId}</span>
            </div>
        );
    }
}

export default GameId;