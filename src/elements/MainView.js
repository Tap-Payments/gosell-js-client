import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Pay from './Pay';
import Save from './Save';
import SideMenu from './SideMenu';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';

class MainView extends Component {

  render() {
      let store = this.props.store;

      let view = null;

      switch (store.configStore.transaction_mode) {
        case 'charge':
          view = (<Pay store={store}/>);
          break;
        case 'authorize':
            view = (<Pay store={store}/>);
            break;
        case 'save_card':
            view = (<Save store={store}/>);
            break;
        case 'token':
            view = (<Save store={store}/>);
            break;
      }

      return (
          <React.Fragment>
            {view}

            {!store.isMobile ?
              <React.Fragment>
                <SideMenu key={0} id='currencies' dir={store.uIStore.dir}  animationDuration={'300ms'}  expand={store.uIStore.getSubPage === 0 ? true : false} width={110}>
                    <SupportedCurrencies dir={store.uIStore.dir} store={store} width='105px' height={store.uIStore.browser === "IE" ? store.uIStore.mainHeight + 192 + 'px' : "100%"} />
                </SideMenu>

                <SideMenu key={1} id='business-info' dir={store.uIStore.dir}  animationDuration={'600ms'} expand={store.uIStore.getSubPage === 1 ? true : false} width={200}>
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
