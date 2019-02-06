import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import SaveForm from './SaveForm';
import Options from './Options';
import Paths from '../../webpack/paths';
// import bill from '../assets/imgs/bill.svg';
import TapButton from './TapButton';
import Otp from './Otp';
// import SwipeableViews from 'react-swipeable-views';
import ExtraFees from './ExtraFees';
// import TapSlider from '@tap-payments/tap-react-slider'
import TapSlider from '../TapSlider2/TapSlider';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';
import styled from "styled-components";


class Pay extends Component {

  constructor(props){
    super(props);
    this.state = {
      payment: null
    }
  }

  componentDidMount(){
    this.props.store.uIStore.setPageIndex(0, 'y');
  }


  componentWillUnmount(){
    this.setState({
      payment: null
    });
  }

  handlePayBtnClick(){
    var store = this.props.store;

    if(store.uIStore.getIsActive === 'FORM'){
      store.uIStore.startBtnLoader();
      //get card token
      store.formStore.generateToken().then(result => {
         // console.log('generate token', store.paymentStore.active_payment_option);
         // store.paymentStore.getFees(store.paymentStore.active_payment_option.brand);

         if(store.paymentStore.active_payment_option_fees > 0){
           store.uIStore.setPageIndex(1, 'y');
           // store.uIStore.confirm = 0;
         }
         else {
           store.uIStore.startLoading('loader', 'Please Wait');

           store.apiStore.handleTransaction(store.paymentStore.source_id, 'FORM', 0.0).then(result =>{
             console.log(' ......>>>>>>>>> ', result);
             store.uIStore.stopBtnLoader();
           });
         }
       });
    }
    else {
      store.actionStore.onPayBtnClick();
    }
  }



  render() {

    let store = this.props.store;

    var title = '', self = this, cards = {};

    var total = store.paymentStore.active_payment_option_total_amount > 0 ? store.paymentStore.current_currency.symbol + store.uIStore.formatNumber(store.paymentStore.active_payment_option_total_amount.toFixed(store.paymentStore.current_currency.decimal_digit)) : '';

     return (
       <TapSlider
           componentKey={store.uIStore.getPageIndex}
           axis={store.uIStore.pageDir}
           animationDuration={1000}
           style={{ height:'100%', width:'100%'}}
           direction={store.uIStore.getDir}>

                <div key={0} style={{height: '100%', position:'relative'}}>
                  <Options store={store}/>

                  <div style={{height: '86px', position:'relative'}}>
                        <TapButton
                          id="tap-pay-btn"
                          dir={store.uIStore.getDir}
                          width="90%"
                          height="44px"
                          btnColor={'#2ACE00'}
                          active={store.uIStore.pay_btn}
                          animate={this.props.store.uIStore.getBtnLoaderStatus}
                          handleClick={this.handlePayBtnClick.bind(this)}>{store.configStore.btn +' '+ total}</TapButton>
                  </div>

               </div>

                <div key={1} style={{height: '100%', position:'relative'}}>
                    <ExtraFees dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={2} style={{height: '100%', position:'relative'}}>
                    <Otp dir={store.uIStore.getDir} store={store} />
                </div>

                <div key={3} style={{height: '100%', position:'relative'}}>
                    <SupportedCurrencies theme="inline" bgColor="white" dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={4} style={{height: 'fit-content', position:'relative'}}>
                    <BusinessInfo store={store} width="100%"/>
                </div>


        </TapSlider>);
  }
}

export default observer(Pay);
