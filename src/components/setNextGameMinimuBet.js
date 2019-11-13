import React from 'react';
import {setNextGameMinimumBet} from '../ethereum/eth_modules/managerFunctions';
import { Button, Form, Input } from 'semantic-ui-react';

class SetNextGameMinimumBet extends React.Component {

    state = {
        minimumBet: undefined,
    };

    getMoney = async (event) => {
        event.preventDefault();
        await setNextGameMinimumBet(this.state.minimumBet.toString());
    };

    handleInputChange = (event) => {
        this.setState({minimumBet: event.target.value});
        console.log(event.target.value);
    };

    render() {

        return (
            <div>
                <Form onSubmit={this.getMoney}>
                    <Input placeholder='money' onChange={this.handleInputChange}/>
                    <Button type='submit' primary>Set Next Game Maximum Bet</Button>
                </Form>
            </div>
        );
    }
}

export default SetNextGameMinimumBet;