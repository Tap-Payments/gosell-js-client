import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import PaymentOptions from './PaymentOptions';
import Message from './Message';
import gatewayStore from '../Store/GatewayStore.js';
import businessStore from '../Store/BusinessStore.js';
import SideMenu from './SideMenu';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';

class MainView extends Component {

  render() {

      return (
          <React.Fragment>
            <PaymentOptions />
            {gatewayStore.getSupportedCurrencies && gatewayStore.getSupportedCurrencies.length > 0 ?
            <SideMenu id='currencies' animationDuration={'300ms'}  expand={gatewayStore.getSubPage === 0 ? true : false} width='105px'>
                <SupportedCurrencies width='105px'/>
            </SideMenu>
            : null}

            {businessStore.getContact && Object.keys(businessStore.getContact).length > 0 ?
            <SideMenu id='business-info' animationDuration={'600ms'} expand={gatewayStore.getSubPage === 1 ? true : false} width='200px'>
                <BusinessInfo width="60px" style={{width: "60px", backgroundColor: 'rgba(0,0,0,0.25)'}}/>
            </SideMenu>
            : null}
          </React.Fragment>
      );

  }

}

export default observer(MainView);
