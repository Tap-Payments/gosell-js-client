import React, { Component }  from "react";
import DemoConfigStore from './store/DemoConfigStore';
import GatewaySettings from './src/elements/GatewaySettings';
import CustomerSettings from './src/elements/CustomerSettings';
import OrderSettings from './src/elements/OrderSettings';
import Demo from './src/elements/Demo';

class OpenLightBox extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    DemoConfigStore.reset();
  }

  render() {

    return (
      <div className="App">
        <div className='app-form'>
          <div className='app-columns'>
            <GatewaySettings
              store={DemoConfigStore}/>
          </div>
          <div className='app-columns'>
            <CustomerSettings
              store={DemoConfigStore}/>
            <OrderSettings
              store={DemoConfigStore}/>
          </div>
          <div className='app-columns'>
            <Demo
              store={DemoConfigStore}/>
          </div>
        </div>
      </div>
    );
  }
}

export default OpenLightBox;
