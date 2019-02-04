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
import Order from './Order';
import Items from './Items/Items';

const styles = {
    'row1':{
      'rowContainer': {
         height: '65px',
         backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
    },
      'textStyle': {width: '100%', textAlign: 'center'},
      'iconStyle': {width: '65px', height: '65px'}
    },
    'row2':{
      'rowContainer': { backgroundColor: 'white',
      '&:hover': {
      //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
      }
    },
      'iconStyle': {width: '65px', height: '48px'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px'
      }
    },
    'order_row':{
      'rowContainer': { backgroundColor: 'white',
      textAlign: 'center',
      height: '30px',
      '&:hover': {
      //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
      }
    },
      // 'iconStyle': {width: '100px', height: '30px'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '12px'
      }
    }
}

class Pay extends Component {

  constructor(props){
    super(props);
    this.state = {
      payment: null
    }
  }

  componentDidMount(){
    this.props.store.uIStore.setPageIndex(0, 'y');
    // this.props.store.uIStore.mainHeight = this.options.clientHeight;
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

  componentWillUnmount(){
    this.setState({
      payment: null
    });
  }

  render() {

    let store = this.props.store;

    var title = '', self = this, cards = {};


    // console.log("OOOOOOOOOOOOOOOOOOO ", this.options.clientHeight);
    // var mainHeight = this.options.clientHeight

    console.log('from pay.js ---------------------> ', this.props.store.uIStore.pay_btn);

     var total = store.paymentStore.active_payment_option_total_amount > 0 ? store.paymentStore.current_currency.symbol + store.uIStore.formatNumber(store.paymentStore.active_payment_option_total_amount.toFixed(store.paymentStore.current_currency.decimal_digit)) : '';

     console.log('items ================================= >>> ', store.configStore.items);

     return (
       <TapSlider
           componentKey={store.uIStore.getPageIndex}
           axis={store.uIStore.pageDir}
           animationDuration={1000}
           style={{ height:'100%', width:'100%'}}
           direction={store.uIStore.getDir}>

                <div key={0} style={{height: '100%', position:'relative'}}>

                  <div className="gosell-order-details" style={store.uIStore.show_order_details ? {height: store.uIStore.mainHeight} : {}}>

                      <div style={{height: 'fit-content'}}>
                        <Items
                          desc={store.configStore.tranx_description}
                          items={store.configStore.items}
                          total={store.configStore.order.symbol + store.uIStore.formatNumber(store.configStore.order.amount.toFixed(store.configStore.order.decimal_digit))}/>
                      </div>

                  </div>

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

                <div key={5} style={{height: 'fit-content', position:'relative'}}>
                    {
                      // <Order onClick={store.actionStore.handleOrderDetailsClick}>Order Details</Order>
                      // <OrderDetails className={store.uIStore.show_order_details ? "order-details order-show-details" : "order-details"} onClick={store.actionStore.handleOrderDetailsClick}>
                      //   TEST TEST TEST TEST TEST TEST
                      // </OrderDetails>
                    }
                    <Order dir={store.uIStore.getDir} store={store}/>

                </div>

        </TapSlider>);
  }
}

export default observer(Pay);
