import React from 'react';
import diceGame from '../ethereum/eth_modules/diceGame';
import { Button } from 'semantic-ui-react';

class GetBalance extends React.Component {

    state = {
        balance: null
    };

    getBalance = async () => {
        const balance = Number(await diceGame.methods.getContractBalance().call({ from: '0xCE2496baff9b404b9C8f5445B48bA92441ed6B33' }));
        this.setState({balance});
    };

    render() {

        const style = {
            fontWeight: 'bold',
            fontSize: '21px',
            marginLeft: '25px'
        };

        const balance = (this.state.balance === null) ? '' : this.state.balance.toString() + ' Wei';

        return (
            <div>
                <Button onClick={this.getBalance}>Get Contract Balance</Button>
                <span style={style}>{balance}</span>
            </div>
        );
    }
}

export default GetBalance;