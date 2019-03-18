import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Options from './Options';
import Paths from '../../webpack/paths';
import TapButton from './TapButton';
import Otp from './Otp';
import ExtraFees from './ExtraFees';
import TapSlider from '../lib/tapSlider/TapSlider';
import SupportedCurrencies from './SupportedCurrencies';
import BusinessInfo from './BusinessInfo';
import Items from './Items/Items';
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

  handlePayAction(){
    var store = this.props.store;

    if(store.uIStore.getIsActive === 'FORM'){
      //get card token
      store.formStore.generateToken().then(result => {

         if(store.paymentStore.active_payment_option_fees > 0){
           store.uIStore.setPageIndex(1, 'y');
         }
         else {
           store.uIStore.startLoading('loader', store.localizationStore.getContent('please_wait_msg', null));

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
  }

  handlePayBtnClick(){

    var store = this.props.store;
    store.uIStore.goSellBtn({
      active: true,
      loader: true,
    });

    switch (store.uIStore.getPageIndex) {
      case 0:
        this.handlePayAction();
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

    var title = '', self = this, cards = {};

    // console.log('options height', store.uIStore.mainHeight);

    // console.log('btn btn ', store.uIStore.btn);

    var symbol = store.localizationStore.getContent('supported_currencies_symbol_' + store.configStore.order.currency.toLowerCase(), null);
    var order_labels = {items: store.localizationStore.getContent('items_list_title', null), desc: store.localizationStore.getContent('tranx_description_title', null)};


     return (
       <React.Fragment>
       <TapSlider
           componentKey={store.uIStore.getPageIndex}
           axis={store.uIStore.pageDir}
           animationDuration={store.actionStore.sliderAnimationDuration}
           style={{ height: store.uIStore.sliderHeight + "px", width:'100%'}}
           direction={store.uIStore.dir}
           animationStatus = {this.animationStatusHandler.bind(this)}>

                <div key={0} id="gosell-gateway-main-container" style={{width: '100%', height: (store.uIStore.mainHeight + 86) + 'px', position:'relative'}}>
                  <Options store={store}/>
               </div>

                <div key={1} style={{width: '100%', height: '100%', position:'relative'}}>
                    <ExtraFees dir={store.uIStore.dir} store={store}/>
                </div>

                <div key={2} style={{width: '100%', height: '100%', position:'relative'}}>
                    <Otp dir={store.uIStore.dir} store={store} />
                </div>

                <div key={3} style={{width: '100%', height: store.uIStore.mainHeight + 'px', position:'relative'}}>
                    <SupportedCurrencies theme="inline" bgColor="white" height="100%" dir={store.uIStore.dir} store={store}/>
                </div>

                <div key={4} style={{width: '100%', height: store.uIStore.mainHeight + 'px', position:'relative'}}>
                     <BusinessInfo store={store} width="100%" height="100%"/>
                </div>

                <div key={5} style={{width: '100%', height: store.uIStore.mainHeight + 'px', position:'relative', overflow: 'auto'}}>
                        <Items
                          dir={store.uIStore.dir}
                          desc={store.configStore.tranx_description}
                          items={store.configStore.items}
                          labels={order_labels}
                          total={symbol + store.uIStore.formatNumber(store.configStore.order.amount.toFixed(store.configStore.order.decimal_digit))}/>
                </div>

        </TapSlider>

        {store.uIStore.getPageIndex != 3 && store.uIStore.getPageIndex != 4 ?
          <div style={{height: '86px', position: 'relative', width: '100%'}}>
                <TapButton
                  id="gosell-gateway-btn"
                  dir={store.uIStore.dir}
                  width="90%"
                  height="44px"
                  btnColor={store.uIStore.btn.color}
                  active={store.uIStore.btn.active}
                  animate={store.uIStore.btn.loader}
                  handleClick={this.handlePayBtnClick.bind(this)}
                  store={store}>{store.uIStore.btn.title}</TapButton>
          </div>
        : null}

        </React.Fragment>
      );
  }
}

export default observer(Pay);
