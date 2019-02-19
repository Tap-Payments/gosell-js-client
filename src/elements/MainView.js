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
      // let height;
      // switch (store.configStore.transaction_mode) {
      //   case 'charge':
      //     height = "100%";
      //     break;
      //   case 'authorize':
      //     height = "100%";
      //     break;
      //   case 'save_card':
      //     height = "auto";
      //     break;
      //   case 'get_token':
      //     height = "auto";
      //     break;
      //   default:
      //     height = "100%";
      //     break;
      // }

      return (
          <React.Fragment>
            <PaymentOptions store={store} />
            {!store.getIsMobile ?
              <React.Fragment>
                <SideMenu key={0} id='currencies' dir={store.uIStore.getDir}  animationDuration={'300ms'}  expand={store.uIStore.getSubPage === 0 ? true : false} width={110}>
                    <SupportedCurrencies dir={store.uIStore.getDir} store={store} width='105px' height={store.uIStore.browser === "IE" ? store.uIStore.mainHeight + 192 + 'px' : "100%"} />
                </SideMenu>

                <SideMenu key={1} id='business-info' dir={store.uIStore.getDir}  animationDuration={'600ms'} expand={store.uIStore.getSubPage === 1 ? true : false} width={200}>
                    {store.configStore.contactInfo && store.merchantStore.contact && store.merchantStore.contact.length > 0 ?
                      <BusinessInfo store={store} width="65px" height={store.uIStore.browser === "IE" ? store.uIStore.mainHeight + 192 + 'px' : "auto"} style={{overflow: 'auto'}}/>
                    : null}
                </SideMenu>
              </React.Fragment>
            : null }

          </React.Fragment>
      );

  }

}

export default observer(MainView);
