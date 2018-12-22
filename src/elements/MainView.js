import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import PaymentOptions from './PaymentOptions';
import SideMenu from './SideMenu';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';

class MainView extends Component {

  render() {
      let store = this.props.store;
      return (
          <React.Fragment>
            <PaymentOptions store={store} />

            {store.paymentStore.supported_currencies && store.paymentStore.supported_currencies.length > 0 ?
            <SideMenu id='currencies' dir={store.uIStore.getDir}  animationDuration={'300ms'}  expand={store.uIStore.getSubPage === 0 ? true : false} width='105px'>
                <SupportedCurrencies dir={store.uIStore.getDir} store={store} width='105px' />
            </SideMenu>
            : null}

            {store.merchantStore.contact && Object.keys(store.merchantStore.contact).length > 0 ?
            <SideMenu id='business-info' dir={store.uIStore.getDir}  animationDuration={'600ms'} expand={store.uIStore.getSubPage === 1 ? true : false} width='200px'>
                <BusinessInfo store={store} width="60px" style={{width: "60px", backgroundColor: 'rgba(0,0,0,0.25)'}}/>
            </SideMenu>
            : null}
          </React.Fragment>
      );

  }

}

export default observer(MainView);
