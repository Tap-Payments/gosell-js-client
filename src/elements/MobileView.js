import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import PaymentOptions from './PaymentOptions';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';
import InlineMenu from './InlineMenu';
import Otp from './Otp';
import SwipeableViews from 'react-swipeable-views';

class MobileView extends Component {

  render() {
    let store = this.props.store;

    return(
      <SwipeableViews
        index={store.uIStore.getActivePage}
        springConfig={{
          duration: '0.5s',
          easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
          delay: '0.1s'
        }}
        style={{width: '100%', height: '100%'}}
        containerStyle={{height: 'fit-content'}}
        axis={store.uIStore.getDir === 'ltr'? "x" : "x-reverse"}
        animateHeight={false}
        disabled={true}>
        <div><PaymentOptions store={store}/></div>
        <div style={{height: '100%', position:'relative'}}>
        {store.uIStore.getActivePage == 1 ?
           <SwipeableViews
             springConfig={{
               duration: '0.5s',
               easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
               delay: '0s'
             }}
             axis={store.uIStore.getDir === 'ltr'? "x" : "x-reverse"}
             index={store.uIStore.getSubPage}>
              <SupportedCurrencies theme="inline" bgColor="white" dir={store.uIStore.getDir} store={store}/>
              <BusinessInfo store={store} width="100%"/>

            </SwipeableViews>
            :null}
        </div>
      </SwipeableViews>
    );
  }
}

export default observer(MobileView);
