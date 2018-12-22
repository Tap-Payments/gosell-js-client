import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import CardsForm from './CardsForm';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import bill from '../assets/imgs/bill.svg';
import TapButton from './TapButton';
import Otp from './Otp';
import SwipeableViews from 'react-swipeable-views';
import ExtraFees from './ExtraFees';

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
    this.props.store.uIStore.setPageIndex(0);
  }

  handleWebClick(payment){
    this.setState({
      payment: payment
    });

    this.props.store.actionStore.onWebPaymentClick(payment);
  }

  handlePayBtnClick(){
    var store = this.props.store;

    if(store.uIStore.getIsActive === 'FORM'){
      store.uIStore.startBtnLoader();
      //get card token
      this.refs.paymentForm.generateToken().then(result => {
          // console.log('generate token', store.paymentStore.active_payment_option);
          // store.paymentStore.getFees(store.paymentStore.active_payment_option.brand);

          if(store.paymentStore.active_payment_option_fees > 0){
            store.uIStore.setPageIndex(1);
            store.uIStore.confirm = 0;
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

    let old = store.configStore.order;
    let current =  store.paymentStore.current_currency;
    let old_amount = store.uIStore.formatNumber(old.amount.toFixed(old.decimal_digit));
    let new_amount = store.uIStore.formatNumber(current.amount.toFixed(current.decimal_digit));

    if(current.currency === old.currency)
    {
        title= {'main': old.symbol + ' ' + old_amount }
    }
    else {
        title= {'secondary': old.symbol + ' ' + old_amount, 'main': current.symbol + ' ' + new_amount}
    }

    const WebPayments = store.paymentStore.getWebPaymentsByCurrency.map((payment, index) =>

              <div key={'div-'+index}>
                <Row
                  key={payment.id}
                  dir={store.uIStore.getDir}
                  style={styles.row2}
                  rowIcon={<Img imgSrc={payment.image} imgWidth="30"/>}
                  rowTitle={{'secondary': payment.name}}
                  onClick={this.handleWebClick.bind(this, payment)}
                  addArrow={true}/>

                  <Separator key={'separator-'+index}/>
              </div>
      );


      if(store.paymentStore.customer_cards_by_currency){
          const CardsList = store.paymentStore.customer_cards_by_currency.map((payment, index) =>
            <div key={'div-'+index}>
                <Img imgSrc={payment.image} imgWidth="30"/>
            </div>
          );
      }

      console.log('customer cards by currency from pay.js', store.paymentStore.customer_cards_by_currency);

     var total = store.paymentStore.active_payment_option_total_amount > 0 ? store.paymentStore.current_currency.symbol + store.uIStore.formatNumber(store.paymentStore.active_payment_option_total_amount.toFixed(current.decimal_digit)) : '';
     console.log('pay status !!!!!!!!!!!!!!!!!!!!!!!!1!!!!', store.uIStore.pay_btn);
     return (
        <SwipeableViews
              containerStyle={{height: '100%', position:'relative'}}
              style={{height: '100%',width: '100%'}}
              slideStyle={{height: '100%', overflow: 'hidden'}}
              index={store.uIStore.getPageIndex}
              springConfig={{
                duration: '0.5s',
                easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
                delay: '0.2s'
              }}
              axis="y"
              animateHeight={false}
              disabled={true}>
                <div style={{height: '100%', position:'relative'}}>
                  <Separator />
                  {store.paymentStore.supported_currencies && store.paymentStore.supported_currencies.length > 1 ?
                  <Row
                    id="currencies"
                    ref={(node) => this.currencies = node}
                    dir={store.uIStore.getDir}
                    style={styles.row1}
                    rowIcon={<Img imgSrc={bill} imgWidth="18" style={
                      store.uIStore.getDir === 'ltr' ?
                      {borderRight: '0.5px solid rgba(0, 0, 0, 0.17)'}
                       : {borderLeft: '0.5px solid rgba(0, 0, 0, 0.17)'}}/>}
                    rowTitle={title}
                    onClick={this.props.store.actionStore.currenciesHandleClick}
                    addArrow={true}/>
                  :
                  <Row
                    id="currencies"
                    ref={(node) => this.currencies = node}
                    dir={store.uIStore.getDir}
                    style={styles.row1}
                    rowTitle={title}
                    onClick={this.props.store.actionStore.currenciesHandleClick}
                    addArrow={false}/>
                  }
                  <Separator />

                  {store.paymentStore.customer_cards_by_currency && store.paymentStore.customer_cards_by_currency.length > 0 ?
                      <Cards ref="cards" store={store} cards={store.paymentStore.customer_cards_by_currency} dir={store.uIStore.getDir}/>
                  : null}

                  {WebPayments.length > 0 || store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                    <Label title="Others" dir={store.uIStore.getDir}/>
                  : <div style={{marginBottom: '20px'}}></div>}

                  {WebPayments.length > 0 ?
                    <div style={{marginBottom: '20px'}}>
                      <Separator />
                      {WebPayments}
                    </div>
                  : null }

                  {store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                    <CardsForm ref="paymentForm" store={store} saveCardOption={true}/>
                  : null }

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

                  {store.uIStore.getPageIndex === 1 ?
                    <div style={{height: '100%', position:'relative'}}>
                    <SwipeableViews
                      containerStyle={{height: '100%', position:'relative'}}
                      style={{height: '100%',width: '100%'}}
                      slideStyle={{height: '100%', overflow: 'hidden'}}
                      index={store.uIStore.confirm}
                      springConfig={{
                        duration: '0.5s',
                        easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
                        delay: '0.2s'
                      }}
                      axis="y"
                      animateHeight={false}
                      disabled={true}>
                      <div style={{height: '100%', position:'relative'}}>
                         {store.uIStore.confirm === 0 ?
                            <ExtraFees dir={store.uIStore.getDir} store={store}/>
                          : null}
                        </div>

                      <div style={{height: '100%', position:'relative'}}>
                        {store.uIStore.confirm === 1 ?
                            <Otp dir={store.uIStore.getDir} store={store} />
                        : null}
                      </div>
                     </SwipeableViews>
                     </div>
                  : null }
        </SwipeableViews>);
  }
}

export default observer(Pay);
