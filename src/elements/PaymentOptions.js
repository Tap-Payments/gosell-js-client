import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import bill from '../assets/imgs/bill.svg';
import gatewayStore from '../Store/GatewayStore.js';
import mainStore from '../Store/MainStore.js';
import TapButton from './TapButton';
import Otp from './Otp';
import Message from './Message';
import SwipeableViews from 'react-swipeable-views';

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

class PaymentOptions extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  componentWillMount(){
    gatewayStore.setPageIndex(1);
  }

  componentDidMount(){
    gatewayStore.setPageIndex(0);
  }

  handleClick(){

    if(gatewayStore.getActivePage === 1 && gatewayStore.getSubPage === 0){
      gatewayStore.getIsMobile ? gatewayStore.setSubPage(0) : gatewayStore.setSubPage(-1);
      gatewayStore.setActivePage(0);
    }
    else if(gatewayStore.getActivePage === 1 && gatewayStore.getSubPage === 1){
      gatewayStore.setActivePage(0);
      gatewayStore.setSubPage(0);
      gatewayStore.setActivePage(1);
    }
    else{
      gatewayStore.setSubPage(0);
      gatewayStore.setActivePage(1);
    }

  }

  openOTP(){
    gatewayStore.getIsMobile ? gatewayStore.setSubPage(0) : gatewayStore.setSubPage(-1);
    gatewayStore.setPageIndex(1);
  }

  open(url){
    window.open(url,'_blank');
  }

  render() {
    let current =  gatewayStore.getCurrentCurrency;
    let customer = gatewayStore.getCustomerCurrency;

    var title = '';


    var cards = {};

        if(Object.keys(mainStore.getMsg).length < 1){

          var customerNum = customer.amount;
          var currentNum = current.amount;


          if(current.symbol === customer.symbol)
          {
              title= {'main': customer.symbol + ' ' + customerNum }
          }
          else {
              title= {'secondary': customer.symbol + ' ' + customerNum, 'main': current.symbol + ' ' + currentNum }
          }

          var self = this;

          console.log('web', gatewayStore.getWebPaymentsByCurrency);
          const WebPayments = gatewayStore.getWebPaymentsByCurrency.map((payment, index) =>

            <div key={'div-'+index}>
              <Row
                key={payment.id}
                dir={gatewayStore.getDir}
                style={styles.row2}
                rowIcon={<Img imgSrc={payment.image} imgWidth="30" imgHeight="30"/>}
                rowTitle={{'secondary': payment.name}}
                onClick={self.open.bind(this, 'https://www.tap.company')}
                addArrow={true}/>

                <Separator key={'separator-'+index}/>
            </div>
          );

          return (
            <SwipeableViews
              containerStyle={{height: '100%'}}
              style={{height: '100%', width: '100%'}}
              slideStyle={{height: '100%'}}
              index={gatewayStore.getPageIndex}
              springConfig={{
                duration: '0.5s',
                easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
                delay: '0.1s'
              }}
              axis="y"
              animateHeight={false}
              disabled={true}>
                <div style={{height: '100%', position: 'relative'}}>
                  <Separator />
                  <Row
                    dir={gatewayStore.getDir}
                    style={styles.row1}
                    rowIcon={<Img imgSrc={bill} imgWidth="18" style={
                      gatewayStore.getDir === 'ltr' ?
                      {borderRight: '0.5px solid rgba(0, 0, 0, 0.17)'}
                       : {borderLeft: '0.5px solid rgba(0, 0, 0, 0.17)'}}/>}
                    rowTitle={title}
                    onClick={this.handleClick.bind(this)}
                    addArrow={true}/>

                  <Separator />

                  {gatewayStore.getCards ?
                    <React.Fragment>
                      <Label title="Recent" dir={gatewayStore.getDir}/>
                      <Cards cards={gatewayStore.getCards} dir={gatewayStore.getDir}/>
                    </React.Fragment>
                  : null}

                  {WebPayments.length > 0 ?
                    <React.Fragment>
                      <Label title="Others" dir={gatewayStore.getDir}/>
                      <Separator />
                      {WebPayments}
                    </React.Fragment>
                  : null }

                  <TapButton id="tap-pay-btn" width="90%" height="44px" btnColor={'#2ACE00'} active={true} animate={false} onClick={this.openOTP.bind(this)}>Pay</TapButton>

                </div>

                <div style={{height: '100%'}}>
                  <Otp dir={gatewayStore.getDir}/>
                </div>

            </SwipeableViews>
          );
        }
        else{
          return(

            <Message icon={null} type={mainStore.getMsg.type} title={mainStore.getMsg.title} desc={mainStore.getMsg.desc}/>
          );
        }

  }

}
//<Otp dir="ltr"/>
export default observer(PaymentOptions);
