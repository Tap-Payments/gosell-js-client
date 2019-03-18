import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Pay from './Pay';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';
import Otp from './Otp';
// import SwipeableViews from 'react-swipeable-views';
// import TapSlider from '@tap-payments/tap-react-slider'
// import TapSlider from '../TapSlider2/TapSlider';

// class MobileView extends Component {
//
//   render() {
//     let store = this.props.store;
//
//     return(
//       <TapSlider
//           componentKey={store.uIStore.getActivePage}
//           axis={store.uIStore.activePageDir}
//           animationDuration={1000}
//           style={{ height:'100%',width:'100%'}}
//           direction={store.uIStore.dir}>
//
//           <Pay store={store}/>
//
//           <SupportedCurrencies theme="inline" bgColor="white" dir={store.uIStore.dir} store={store}/>
//           <BusinessInfo store={store} width="100%"/>
//         </TapSlider>
//     );
//   }
// }


// {store.configStore.transaction_mode === 'charge' || store.configStore.transaction_mode === 'authorize' ?
// <PaymentOptions store={store} />
// : <SaveCard store={store}/>}
export default observer(MobileView);
