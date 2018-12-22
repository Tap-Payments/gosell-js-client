import React, { Component }  from 'react';
import Row from './Row';
import Img from './Img';
import TapButton from './TapButton';
import Switcher from './Switcher';
import '../assets/css/cardsForm.css';
import {observer} from 'mobx-react';
import styled from "styled-components";

class CardsForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      tap: null,
      card: null,
      currency:null,
      active: false,
      animate: false,
      hide: false,
    }
  }

  componentDidMount(){
    this.cardForm();
  }

  cardForm(){
    var store = this.props.store;

    var tap = null;
    var self = this;

    tap = store.formStore.generateForm(this.props.store.configStore.gateway.publicKey);

    this.setState({
      tap: tap
    });

    var elements = tap.elements({});

    var style = this.props.store.configStore.style;

    var paymentOptions = {};

    console.log('current currency', this.props.store.paymentStore.current_currency);

    // if(store.configStore.gateway.supportedCurrencies === 'all'
    //   && (store.configStore.transaction_mode === 'get_token' || store.configStore.transaction_mode === 'save_card')){
    //    paymentOptions = {
    //       labels : this.props.store.configStore.labels,
    //       paymentAllowed: this.props.store.configStore.gateway.supportedPaymentMethods,
    //       TextDirection: this.props.store.paymentStore.getDir
    //     }
    // }
    // else if(store.configStore.supportedCurrencies != 'all'
    //   && (store.configStore.transaction_mode === 'get_token' || store.configStore.transaction_mode === 'save_card')){
    if(store.configStore.transaction_mode === 'get_token' || store.configStore.transaction_mode === 'save_card'){
        paymentOptions = {
         currencyCode: this.props.store.paymentStore.currencies,
         labels : this.props.store.configStore.labels,
         paymentAllowed: this.props.store.configStore.gateway.supportedPaymentMethods,
         TextDirection: this.props.store.paymentStore.getDir
       }
    }
    else {
       paymentOptions = {
        currencyCode: [this.props.store.paymentStore.current_currency.currency],
        labels : this.props.store.configStore.labels,
        paymentAllowed: this.props.store.configStore.gateway.supportedPaymentMethods,
        TextDirection: this.props.store.paymentStore.getDir
      }
    }


    var card = elements.create('card', {style: style}, paymentOptions);
    card.mount('#element-container');

    var bin = true;
    var active_brand = null;

    card.addEventListener('change', function(event) {
      console.log('event', event);

      if(event.code == 200){
        self.props.store.paymentStore.save_card_active = true;
        self.props.store.uIStore.setIsActive('FORM');
        self.props.store.uIStore.payBtn(true);

        if(self.props.store.configStore.transaction_mode === 'save_card'){
          self.props.store.paymentStore.saveCardOption(true);
        }
      }

      if(event.BIN && event.BIN.card_brand !== active_brand){
          console.log(event.BIN.card_brand);
          self.props.store.paymentStore.getFees(event.BIN.card_brand);
          console.log(active_brand, event.BIN);
          active_brand = event.BIN.card_brand;
      }

      // if(event.loaded){
      //   console.log('loaded!!!!! ', event.loaded);
      //   self.props.store.uIStore.JSLibisLoading = true;
      // }

      if(event.code == 400 || (event.error_interactive && event.error_interactive.code == 400)){

        self.props.store.uIStore.payBtn(false);
        self.props.store.paymentStore.save_card_option = false;

        if(event.error_interactive){
          self.props.store.uIStore.setErrorHandler({
            visable: true,
            code: event.error_interactive.code,
            msg: event.error_interactive.message,
            type: 'error'
          });
        }

      	if(event.error && event.error.code && (event.error.code === 409 || event.error.code === 403)){
      		//hide form here
          self.setState({
            hide: true
          });

          if(event.error.code === 403){
            self.props.store.uIStore.setErrorHandler({
              visable: true,
              code: event.error.code,
              msg: event.error.message,
              type: 'error'
            });
          }
      	}
        else {
          self.setState({
            hide: false
          });
        }
      }
    });

    window.setInterval(self.checkFocus.bind(this), 10);

      this.setState({
        card: card,
        tap: tap,
        currency: this.props.store.paymentStore.current_currency.currency
      });
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.store.paymentStore.current_currency.currency != this.state.currency){
      this.setState({
        currency: nextProps.store.paymentStore.current_currency.currency
      });

      this.state.card.clearForm();
    }

    if(nextProps.store.uIStore.getIsActive !=='FORM'){
      this.state.card.clearForm();
    }

    if(this.props.store.configStore.transaction_mode !== 'get_token' && this.props.store.configStore.transaction_mode !== 'save_card'){
    {
      this.state.card.currency([nextProps.store.paymentStore.current_currency.currency]);
    }

  }
 }

 checkFocus() {

   var self = this;
   var statusFocus = null;

   var isfocused = document.getElementById("myFrame");

       if(document.activeElement == isfocused) {
         if(statusFocus != false){
             statusFocus=false;
             self.props.store.actionStore.cardFormHandleClick(self.formRef);
             //return {"statusFocus":statusFocus,'message':"iframe has focus"};
         }
       } else {
         if(statusFocus != true){
             statusFocus=true;
             //return {"statusFocus":statusFocus,'message':"iframe has not focused"};
         }
       }

       return;
  }

  async generateToken() {
    var self = this;

    await this.state.tap.createToken(this.state.card).then(function(result) {

        if (result.error) {
              // Inform the user if there was an error
              self.props.store.uIStore.setErrorHandler({
                visable: true,
                code: 0,
                msg: result.error.message,
                type: 'error'
              });

        } else {
              // Send the token to your server
              self.props.store.uIStore.setErrorHandler({
                visable: true,
                code: 200,
                msg: result.id,
                type: 'success'
              });

              self.props.store.uIStore.setIsActive('FORM');
              console.log('result ----> ', result);
              self.props.store.paymentStore.source_id = result.id;
              self.props.store.paymentStore.active_payment_option = result.card;
              console.log('card details', result.card);

        }
    });
   }

  clearCardForm(){
    this.state.card.clearForm();
  }

  handleClick(){
    this.setState({
      animate: false
    });
  }

  componentWillUnmount(){
    this.setState({
      tap: null,
      card: null,
      currency:null,
      active: false,
      animate: false,
      hide: false,
    });
  }

  render() {

    let store = this.props.store;

    let styles = {
      'rowContainer': { backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
      },
      'iconStyle': {width: '100%', height: '48px', display: 'flex', flexDirection: 'row', justifyContent: store.uIStore.getDir === 'ltr' ? 'left' : 'right'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px'
      }
    }

    const SaveCardContainer = styled.div`
      height: 56px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      direction: ${store.uIStore.getDir};
      margin-left: ${store.uIStore.getDir === 'ltr' ? '15%' : '16px'};
      margin-right: ${store.uIStore.getDir === 'rtl' ? '15%' : '16px'};
    `

    const SaveCardTitle = styled.div`
      font-size: 13px;
      color: rgba(0,0,0,0.64);
      letter-spacing: -0.36px;
      text-align: left;
      width: 70%;
      direction: ${store.uIStore.getDir};
      text-align: ${store.uIStore.getDir === 'ltr' ? 'left': 'right'}
    `

    console.log('transaction mode from card form', store.configStore.transaction_mode);
    return(
      <div style={{margin: '0px'}}>

          <div
            id="tap-cards-form"
            ref={(node) => this.formRef = node}
            className={store.uIStore.getIsActive === 'FORM' ? 'tap-card-active tap-form-content' : 'tap-form-content'}
            style={{ backgroundColor: 'white', display: this.state.hide ? 'none' : 'block'}}>

            <form id="form-container" method="post" ref={(node) => this.cardFormRef = node}>
                <div id="element-container"></div>
            </form>

            {store.configStore.gateway && store.configStore.gateway.saveCardOption && this.props.saveCardOption ?
            <SaveCardContainer>
              <SaveCardTitle>
                  For faster and more secure checkout,
                  save your card
              </SaveCardTitle>
              <div style={{ width: '25%' }}>
                <Switcher
                  store={store}
                  style={{ float: store.uIStore.getDir === 'ltr' ? 'right' : 'left'}} />
              </div>
              </SaveCardContainer>
            : null}

          </div>
        </div>
    );
  }
}

export default observer(CardsForm);
