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
import Slide from './Slide';
import ExtraFees from './ExtraFees';

class PaymentOptions extends Component {

  constructor(props){
    super(props);
    this.state = {
      edit: false,
      source_id: null
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
          console.log('generate token', result);

          store.paymentStore.getCardFees(store.paymentStore.active_payment_option.brand);

          if(store.paymentStore.active_payment_option_fees > 0){
            store.uIStore.setPageIndex(1);
            store.uIStore.confirm = 0;
          }
          else {
            store.uIStore.startLoading('loader', 'Please Wait');
            store.apiStore.charge(store.paymentStore.source_id, 'FORM', 0.0).then(result =>{
              console.log('charge ......>>>>>>>>> ', result);
              setTimeout(function(){
                  store.uIStore.setOpenModal(false);
                  store.uIStore.load = false;
                  store.uIStore.isLoading = false;
                  store.uIStore.stopBtnLoader();
               }, 5000);

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

    let old = store.configStore.order;
    let current =  store.paymentStore.current_currency;

    var title = '';

    const styles = {
        'row1':{
          'rowContainer': {
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

    var cards = {};

          if(current.currency === old.currency)
          {
              title= {'main': old.symbol + ' ' + store.uIStore.formatNumber(old.amount) }
          }
          else {
              title= {'secondary': old.symbol + ' ' + store.uIStore.formatNumber(old.amount), 'main': current.symbol + ' ' + store.uIStore.formatNumber(current.amount)}
          }

          var self = this;

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

          // console.log('customer cards by currency', store.paymentStore.customer_cards_by_currency);

          if(store.paymentStore.customer_cards_by_currency){
            const CardsList = store.paymentStore.customer_cards_by_currency.map((payment, index) =>
              <div key={'div-'+index}>
                <Img imgSrc={payment.image} imgWidth="30"/>
              </div>
            );
         }

         console.log("page index", store.uIStore.getPageIndex);
         console.log("confirm", store.uIStore.confirm);

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
                    onClick={this.props.store.actionStore.currenciesHandleClick} //{this.openMenu.bind(this)}
                    addArrow={true}/>
                  : null}
                  <Separator />

                  {store.paymentStore.customer_cards_by_currency.length > 0 ?
                      <Cards ref="cards" store={store} cards={store.paymentStore.customer_cards_by_currency} dir={store.uIStore.getDir}/>
                  : null}

                  {WebPayments.length > 0 || store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                    <Label title="Others" dir={store.uIStore.getDir}/>
                  : null}

                  {WebPayments.length > 0 ?
                    <div style={{marginBottom: '20px'}}>
                      <Separator />
                      {WebPayments}
                    </div>
                  : null }

                  {store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                    <CardsForm ref="paymentForm" store={store}/>
                  : null }
                    <div style={{height: '86px', position:'relative'}}>
                      <TapButton
                        id="tap-pay-btn"
                        width="90%"
                        height="44px"
                        btnColor={'#2ACE00'}
                        active={this.props.store.uIStore.getIsActive === 'FORM' || this.props.store.uIStore.getIsActive === 'CARD' && !store.uIStore.getShakeStatus}
                        animate={this.props.store.uIStore.getBtnLoaderStatus}
                        handleClick={this.handlePayBtnClick.bind(this)}>Pay</TapButton>
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
                            <ExtraFees dir={store.uIStore.getDir} store={store} source={store.paymentStore.source_id} payment={store.paymentStore.active_payment_option}/>
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
            </SwipeableViews>
          );
  }
}

export default observer(PaymentOptions);
