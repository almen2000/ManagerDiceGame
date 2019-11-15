import React from 'react';
import {setNextGameMaximumBet} from '../ethereum/eth_modules/managerFunctions';
import { Button, Form, Input } from 'semantic-ui-react';

class SetNextGameMaximumBet extends React.Component {

    state = {
        maximumBet: undefined,
    };

    getMoney = async (event) => {
        event.preventDefault();
        await setNextGameMaximumBet(this.state.maximumBet.toString());
    };

    handleInputChange = (event) => {
        this.setState({maximumBet: event.target.value});
        console.log(event.target.value);
    };

    render() {

        return (
            <div>
                <Form onSubmit={this.getMoney}>
                    <Input placeholder='maximum bet' onChange={this.handleInputChange}/>
                    <Button type='submit' primary>Set Next Game Maximum Bet</Button>
                </Form>
            </div>
        );
    }
}

export default SetNextGameMaximumBet;