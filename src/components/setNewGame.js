import React from 'react';
import {newGame} from '../ethereum/eth_modules/managerFunctions';
import { Button, Form, Input } from 'semantic-ui-react';

class NewGame extends React.Component {

    state = {
        dice1: undefined,
        dice2: undefined
    };

    getMoney = async (event) => {
        event.preventDefault();
        await newGame(this.state.dice1.toString(), this.state.dice2.toString());
    };

    handleInput1Change = (event) => {
        this.setState({dice1: event.target.value});
        console.log(event.target.value);
    };

    handleInput2Change = (event) => {
        this.setState({dice2: event.target.value});
        console.log(event.target.value);
    };

    render() {

        return (
            <div>
                <Form onSubmit={this.getMoney}>
                    <Input placeholder='money' onChange={this.handleInput1Change}/>
                    <Input placeholder='money' onChange={this.handleInput2Change}/>
                    <Button type='submit' primary>New Game</Button>
                </Form>
            </div>
        );
    }
}

export default NewGame;