import React from 'react';
import {transferMoneyToServer} from '../ethereum/eth_modules/managerFunctions';
import { Button, Form, Input } from 'semantic-ui-react';

class GetMoneyFromServer extends React.Component {

    state = {
        money: undefined,
    };

    getMoney = async (event) => {
        event.preventDefault();
        await transferMoneyToServer(this.state.money.toString());
    };

    handleInputChange = (event) => {
        this.setState({money: event.target.value});
        console.log(event.target.value);
    };

    render() {

        return (
            <div>
                <Form onSubmit={this.getMoney}>
                    <Input placeholder='money' onChange={this.handleInputChange}/>
                    <Button type='submit' primary>Get Money From Server</Button>
                </Form>
            </div>
        );
    }
}

export default GetMoneyFromServer;