import React, { Component }  from "react";
import DemoConfigStore from './store/DemoConfigStore';
import GatewaySettings from './src/elements/GatewaySettings';
import CustomerSettings from './src/elements/CustomerSettings';
import OrderSettings from './src/elements/OrderSettings';
import Demo from './src/elements/Demo';

class GoSellDemo extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div className="App">
        <div className='app-form'>
          <div className='app-columns'>
            <GatewaySettings />
          </div>
          <div className='app-columns'>
            <CustomerSettings />
            <OrderSettings />
          </div>
          <div className='app-columns'>
            <Demo />
          </div>
        </div>
      </div>
    );
  }
}

export default GoSellDemo;
