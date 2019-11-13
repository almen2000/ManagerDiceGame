import React from 'react';
import diceGame from '../ethereum/eth_modules/diceGame';
import { Button } from 'semantic-ui-react';

class NeedMoney extends React.Component {

    state = {
        needToTransfer: null
    };

    getMustHaveBalance = async () => {
        const needToTransfer = await diceGame.methods.needTransferMoney().call({ from: '0xCE2496baff9b404b9C8f5445B48bA92441ed6B33' });
        this.setState({needToTransfer});
    };

    render() {

        const style = {
            fontWeight: 'bold',
            fontSize: '21px',
            marginLeft: '25px'
        };

        const needToTransfer = (this.state.needToTransfer === null) ? '' : this.state.needToTransfer.toString().toUpperCase();

        return (
            <div>
                <Button onClick={this.getMustHaveBalance}>Need Transfer Money</Button>
                <span style={style}>{needToTransfer}</span>
            </div>
        );
    }
}

export default NeedMoney;