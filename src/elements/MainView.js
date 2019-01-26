import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import PaymentOptions from './PaymentOptions';
import SideMenu from './SideMenu';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';

class MainView extends Component {

  render() {
      let store = this.props.store;
      console.log('sub pages +++++++++++++++++++++++++ ', store.uIStore.getSubPage);
      console.log('page dir >>>>>>>>>>>>>>>>>>>>>>>>>>>>', store.uIStore.pageDir);

      return (
          <React.Fragment>

            <PaymentOptions store={store} />
            {!store.getIsMobile ?
              <React.Fragment>
                <SideMenu key={0} id='currencies' dir={store.uIStore.getDir}  animationDuration={'300ms'}  expand={store.uIStore.getSubPage === 0 ? true : false} width='105px'>
                    <SupportedCurrencies dir={store.uIStore.getDir} store={store} width='105px' />
                </SideMenu>

                <SideMenu key={1} id='business-info' dir={store.uIStore.getDir}  animationDuration={'600ms'} expand={store.uIStore.getSubPage === 1 ? true : false} width='200px'>
                    {store.configStore.contactInfo && store.merchantStore.contact && Object.keys(store.merchantStore.contact).length > 0 ?
                      <BusinessInfo store={store} width="60px" style={{width: "60px", backgroundColor: 'rgba(0,0,0,0.25)'}}/>
                    : null}
                </SideMenu>
              </React.Fragment>
            : null }

          </React.Fragment>
      );

  }

}

export default observer(MainView);
