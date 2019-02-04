import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import SaveForm from './SaveForm';
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

class Options extends Component {

  constructor(props){
    super(props);

    this.state = {
      payment: null
    }
  }

  handleWebClick(payment){
    this.setState({
      payment: payment
    });

    this.props.store.actionStore.onWebPaymentClick(payment);
  }

  componentDidMount(){
    var self = this;

    // window.addEventListener('click', function(){
    //   self.mainView.style.height = 'fit-content';
    //   console.log('kdkdkd', self.mainView.style.height);
    //   self.mainView.style.height = self.mainView.clientHeight;
    //   console.log('kdkdkd', self.mainView.style.height);
    // });

    this.props.store.uIStore.mainHeight = this.mainView.clientHeight;
  }


  // componentWillUpdate(){
  //   if(this.props.store.uIStore.mainHeightUpdated){
  //     console.log('+ I am inside will', this.props.store.uIStore.mainHeight);
  //     this.mainView.style.height = '100%';
  //     this.props.store.uIStore.mainHeightUpdated = false;
  //   }
  // }

  componentDidUpdate(){
    if(this.props.store.uIStore.mainHeightUpdated){
      this.props.store.uIStore.mainHeight = this.mainView.clientHeight;
      this.props.store.uIStore.mainHeightUpdated = false;
    }

  }

  render() {

    var store = this.props.store;

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

    return (
      <div ref={el => (this.mainView = el)} id="main-view" className="gosell-order-details" style={!store.uIStore.show_order_details ? { height: store.uIStore.mainHeight} : {}}>
      <Separator />

      {store.paymentStore.supported_currencies && store.paymentStore.supported_currencies.length > 1 ?
      <Row
        id="currencies"
        ref={(node) => this.currencies = node}
        dir={store.uIStore.getDir}
        style={styles.row1}
        rowIcon={<Img imgSrc={Paths.imgsPath + 'bill.svg'} imgWidth="18" style={
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

      </div>
    );
  }
}

export default observer(Options);
