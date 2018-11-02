import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import PaymentOptions from './PaymentOptions';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';
import InlineMenu from './InlineMenu';
import Otp from './Otp';
import Message from './Message';
import gatewayStore from '../Store/GatewayStore.js';
import SwipeableViews from 'react-swipeable-views';

class MobileView extends Component {

  render() {

    return(
      <SwipeableViews
        index={gatewayStore.getActivePage}
        springConfig={{
          duration: '0.5s',
          easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
          delay: '0.1s'
        }}
        style={{width: '100%', height: '100%'}}
        axis={gatewayStore.getDir === 'ltr'? "x" : "x-reverse"}
        animateHeight={false}
        disabled={true}>
        <div><PaymentOptions /></div>
        <InlineMenu>
           <SwipeableViews
             springConfig={{
               duration: '0.5s',
               easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
               delay: '0s'
             }}
             axis={gatewayStore.getDir === 'ltr'? "x" : "x-reverse"}
             index={gatewayStore.getSubPage}>
              <SupportedCurrencies theme="inline" bgColor="white"/>
              <BusinessInfo width="100%"/>
              <Message />

            </SwipeableViews>
        </InlineMenu>
      </SwipeableViews>
    );
  }
}

export default observer(MobileView);
