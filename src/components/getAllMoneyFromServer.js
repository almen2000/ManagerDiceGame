import React from 'react';
import {getAllRequiredMoney} from '../ethereum/eth_modules/managerFunctions';
import { Button } from 'semantic-ui-react';

class GetAllMoney extends React.Component {

    getMoney = async () => {
        await getAllRequiredMoney();
    };

    render() {

        return (
            <div>
                <Button onClick={this.getMoney} primary>Get All Money From Server</Button>
            </div>
        );
    }
}

export default GetAllMoney;