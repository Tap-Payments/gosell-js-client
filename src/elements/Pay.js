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

  componentWillMount(){
    this.props.store.uIStore.goSellBtn({
      title: this.props.store.configStore.btn,
      color: '#2ACE00',
      active: false,
      loader: false
    });
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
    store.uIStore.startBtnLoader();

    switch (store.uIStore.getPageIndex) {
      case 0:
        if(store.uIStore.getIsActive === 'FORM'){
          //get card token
          store.formStore.generateToken().then(result => {

             if(store.paymentStore.active_payment_option_fees > 0){
               store.uIStore.setPageIndex(1, 'y');
             }
             else {
               store.uIStore.startLoading('loader', 'Please Wait');

               store.apiStore.handleTransaction(store.paymentStore.source_id, 'FORM', 0.0).then(result =>{
                 console.log(' ......>>>>>>>>> ', result);
                 // store.uIStore.stopBtnLoader();
               });
             }
           });
        }
        else {
          store.actionStore.onPayBtnClick();
        }
        break;
       case 1:
        store.actionStore.handleExtraFeesClick();
        break;
       case 2:
         store.actionStore.handleOTPClick();
         break;
    }


  }

  animationStatusHandler(){

    console.log("animationStatusHandler");
    console.log(this.props.store.uIStore.targetElement.current);

    if(this.props.store.uIStore.targetElement.current !== null) {
      this.props.store.uIStore.targetElement.current.textInput[0].focus();
    }
  }




  render() {

    let store = this.props.store;

    if(store.uIStore.getIsMobile){
      var styles = {
        height: '86px',
        position: 'absolute',
        width: '90%',
        bottom: 0,
        top:'86.5%'
      }
    }
    else {
      var styles = {
        height: '86px',
        position: 'absolute',
        width: '100%',
        bottom: 0
      }
    }


    var title = '', self = this, cards = {};

    console.log('options height', store.uIStore.mainHeight);

    console.log('btn btn ', store.uIStore.btn);

     return (
       <React.Fragment>
       <TapSlider
           componentKey={store.uIStore.getPageIndex}
           axis={store.uIStore.pageDir}
           animationDuration={1000}
           style={{ height:'100%', width:'100%'}}
           direction={store.uIStore.getDir}
           animationStatus = {this.animationStatusHandler.bind(this)}>

                <div key={0} id="gosell-gateway-main-container" style={{width: '100%', height: (store.uIStore.mainHeight + 86) + 'px', position:'relative'}}>
                  <Options store={store}/>
               </div>

                <div key={1} style={{width: '100%', height: '100%', position:'relative'}}>
                    <ExtraFees dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={2} style={{width: '100%', height: '100%', position:'relative'}}>
                    <Otp dir={store.uIStore.getDir} store={store} />
                </div>

                <div key={3} style={{width: '100%', height: store.uIStore.mainHeight + 'px', position:'relative'}}>
                    <SupportedCurrencies theme="inline" bgColor="white" dir={store.uIStore.getDir} store={store}/>
                </div>

                <div key={4} style={{width: '100%', height: store.uIStore.mainHeight + 'px', position:'relative'}}>
                    <BusinessInfo store={store} width="100%"/>
                </div>

        </TapSlider>

        {store.uIStore.getPageIndex != 3 && store.uIStore.getPageIndex != 4 ?
          <div style={styles}>
                <TapButton
                  id="gosell-gateway-btn"
                  dir={store.uIStore.getDir}
                  width="90%"
                  height="44px"
                  btnColor={store.uIStore.btn.color}
                  active={store.uIStore.btn.active}
                  animate={store.uIStore.btn.loader}
                  handleClick={this.handlePayBtnClick.bind(this)}>{store.uIStore.btn.title}</TapButton>
          </div>
        : null}

        </React.Fragment>
      );
  }
}

export default observer(Pay);
