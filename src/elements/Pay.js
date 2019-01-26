import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import SaveForm from './SaveForm';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import bill from '../assets/imgs/bill.svg';
import TapButton from './TapButton';
import Otp from './Otp';
// import SwipeableViews from 'react-swipeable-views';
import ExtraFees from './ExtraFees';
// import TapSlider from '@tap-payments/tap-react-slider'
import TapSlider from '../TapSlider2/TapSlider';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';

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
    this.props.store.uIStore.setPageIndex(0, 'y');
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

    console.log('from pay.js ---------------------> ', this.props.store.uIStore.pay_btn);

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

     var total = store.paymentStore.active_payment_option_total_amount > 0 ? store.paymentStore.current_currency.symbol + store.uIStore.formatNumber(store.paymentStore.active_payment_option_total_amount.toFixed(store.paymentStore.current_currency.decimal_digit)) : '';

     console.log('index ================================= >>> ', store.uIStore.getPageIndex);

     return (
       <TapSlider
           componentKey={store.uIStore.getPageIndex}
           axis={store.uIStore.pageDir}
           animationDuration={1000}
           style={{ height:'100%', width:'100%'}}
           direction={store.uIStore.getDir}>

                <div key={0} style={{height: '100%', position:'relative'}}>
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
                    rowTitle={this.props.store.paymentStore.getCurrentValue}
                    onClick={this.props.store.actionStore.currenciesHandleClick}
                    addArrow={true}/>
                  :
                  <Row
                    id="currencies"
                    ref={(node) => this.currencies = node}
                    dir={store.uIStore.getDir}
                    style={styles.row1}
                    rowTitle={this.props.store.paymentStore.getCurrentValue}
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
                    <React.Fragment>
                      <Separator />
                        <SaveForm store={store}/>
                      <Separator />
                    </React.Fragment>
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

                <div key={1} style={{height: '100%', position:'relative'}}>
                    <ExtraFees dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={2} style={{height: '100%', position:'relative'}}>
                    <Otp dir={store.uIStore.getDir} store={store} />
                </div>

                <div key={3} style={{height: '100%', position:'relative'}}>
                    <SupportedCurrencies theme="inline" bgColor="white" dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={4} style={{height: '100%', position:'relative'}}>
                    <BusinessInfo store={store} width="100%"/>
                </div>
        </TapSlider>);
  }
}

export default observer(Pay);
