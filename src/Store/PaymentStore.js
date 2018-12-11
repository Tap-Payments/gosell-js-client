import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class PaymentStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.payment_methods = {};
    this.current_amount = 0;
    this.current_currency = {};
    this.settlement_currency = null;
    this.supported_currencies = {};

    this.customer_cards = [];
    this.customer_cards_by_currency = [];
    this.selected_card = null;

    this.webPayments = [];
    this.cardPayments = [];

    this.redirectURL = null;

    this.mode = null;
    this.url = null;

    //save card option
    this.card_wallet = false;
    this.save_card_active = false;
    this.save_card_option = false;

    //3d secure
    this.three_d_Secure = false;

    this.isLoading = true;

/* from here */
    // this.currency = null;
    // this.amount = null;
    // this.customer = null;
    //
    // this.charge_id = null;
    // this.authorize_id = null;
    //
    // this.ref = null;
    // this.tranx_desc = null;
    // this.receipt = null;
    // this.statement_descriptor = null;

    this.transaction = null;

    //otp
    this.status_display_duration = 0;
    this.otp_resend_interval = 0;
    this.otp_resend_attempts = 0;

    this.authenticate = null;

    // this.authorize = false;

    // card token details
    this.active_payment_option = null;
    this.active_payment_option_fees = 0;
    this.source_id = null;

    this.charge = null;

  }

  setThreeDSecure(value){
    var self = this;

    if(value){
      switch (self.RootStore.configStore.transaction_mode) {
        case "charge":
          self.three_d_Secure = self.RootStore.configStore.charge.threeDSecure;
          break;
        case "authorize":
          self.three_d_Secure = self.RootStore.configStore.authorize.threeDSecure;
          break;
        default:
          self.three_d_Secure = value;
      }
    }

  }

  setCards(value){
    this.customer_cards = value;
    this.customer_cards_by_currency = this.savedCardsByCurrency;
  }

  getCardFees(value){
    var self = this;
    var active = self.payment_methods.filter(function(payment){
      if(value.indexOf(payment.name) >= 0){
        self.active_payment_option_fees = payment.extra_fees ? payment.extra_fees[0].value : 0;
        return payment;
      }
    });

    self.active_payment_option = active[0];
  }

  getPaymentMethods(data, currency){

    if(data != null){

      data = JSON.parse(data);
      this.setPaymentMethods(data.payment_methods);
      this.settlement_currency = data.settlement_currency;
      this.setSupportedCurrencies(data.supported_currencies);

      if(this.RootStore.configStore.gateway.customerCards){
        this.setCards(data.cards);
      }

      this.sort();

      var self = this;

      if(Array.isArray(this.supported_currencies) && this.supported_currencies.length > 0){
        self.supported_currencies.forEach(function(cur){

          if(cur.currency === currency){
            self.RootStore.configStore.order = cur;
            //self.current_currency = cur;
            self.setCurrentCurrency(cur);
            self.current_amount = cur.amount;
            self.customer_cards_by_currency = self.savedCardsByCurrency;
          }
        });
      }
      // else {
      //
      //   this.RootStore.apiStore.setMsg({
      //         type: 'warning',
      //         title: 'Currency is not supported',
      //         desc: '...'
      //   });
      // }

      this.isLoading = false;

    }
  }

  setPaymentMethods(value){
    var self = this;
    var config_payment_methods = this.RootStore.configStore.gateway.supportedPaymentMethods;

    if(typeof config_payment_methods === 'object' || Array.isArray(config_payment_methods)){
      self.payment_methods = value.filter(function(el){
          return config_payment_methods.indexOf(el.name) >= 0;
      });
    }
    else {
      self.payment_methods = value;
    }
  }

  computed
  get getWebPaymentsByCurrency(){
    var self = this;

    if(Array.isArray(this.webPayments)){
      var arr = [];
      this.webPayments.forEach(function(payment){
        var curs = payment.supported_currencies;
        for(var i = 0; i < curs.length; i++){
          if(curs[i] === self.current_currency.currency){
            arr.push(payment);
          }
        }
      });

      return arr;
    }
    else {
      return null;
    }
  }

  computed
  get getCardPaymentsByCurrency(){
    var self = this;

    if(Array.isArray(this.cardPayments)){
      var arr = [];
      this.cardPayments.forEach(function(payment){
        var curs = payment.supported_currencies;
        for(var i = 0; i < curs.length; i++){
          if(curs[i] === self.current_currency.currency){
            arr.push(payment);
          }
        }
      });

      return arr;
    }
    else {
      return null;
    }
  }
  //
  // savedCardsByCurrency(){
  //   var self = this;
  //   console.log('currency', self.current_currency);
  //   if(this.customer_cards.length > 0){
  //     var arr = [];
  //     self.customer_cards.forEach(function(card){
  //
  //       var curs = card.supported_currencies;
  //
  //       for(var i = 0; i < curs.length; i++){
  //         if(curs[i] === self.current_currency.currency){
  //           arr.push(card);
  //           console.log('hey ', arr);
  //         }
  //       }
  //
  //     });
  //
  //   }
  //
  // }

  computed
  get savedCardsByCurrency(){
    var self = this;
    console.log('savedCardsByCurrency', self.current_currency.currency);
    if(Array.isArray(this.customer_cards)){
      var arr = [];
      this.customer_cards.forEach(function(card){
        var curs = card.supported_currencies;
        for(var i = 0; i < curs.length; i++){
          if(curs[i] === self.current_currency.currency){
            arr.push(card);
          }
        }
      });

      return arr;
    }
    else {
      return null;
    }
  }

  getCardDetails(cardName){
    if(Array.isArray(this.cardPayments)){
      var self = this;
      var selectedCard = null;
      this.cardPayments.forEach(function(card){

          if(cardName === card.name){
            selectedCard = card;
          }
      });

      return selectedCard;
    }
    else {
      return null;
    }
  }


  setCurrentCurrency(value){
    console.log("current currency", value.currency);
    this.current_currency = value;
    this.customer_cards_by_currency = this.savedCardsByCurrency;
  }

  setSupportedCurrencies(value){

    var self = this;
    var config_currencies = this.RootStore.configStore.gateway.supportedCurrencies;

    if(typeof config_currencies === 'object' || Array.isArray(config_currencies)){
      self.supported_currencies = value.filter(function(el){
          return config_currencies.indexOf(el.currency) >= 0;
      });
    }
    else {
      switch (config_currencies) {
        case 'all':
          self.supported_currencies = value;
          break;
        case 'gcc':
          self.supported_currencies = value.filter(function(el){
            var gcc = ["BHD", "SAR", "AED", "OMR", "QAR", "KWD"];
            return gcc.indexOf(el.currency) >= 0;
          });
          break;
        default:
          self.supported_currencies = value;
          break;
      }
    }
  }


  sort(){
    if(Array.isArray(this.payment_methods)){
      var self = this;

      this.payment_methods.forEach(function(method) {
        if(method.payment_type === 'web'){
          self.webPayments.push(method);
          //self.charge(method.source_id);
        }

        if(method.payment_type === 'card'){
          self.cardPayments.push(method);
        }

      });

    }

  }

  saveCardOption(value){

    if(this.save_card_active && this.card_wallet){
      this.save_card_option = value;
    }
    else {
      this.save_card_option = false;
    }
  }

}

decorate(PaymentStore, {
  payment_methods: observable,
  current_currency: observable,
  current_amount: observable,
  settlement_currency: observable,
  supported_currencies: observable,

  //customer cards list
  customer_cards: observable,
  customer_cards_by_currency: observable,

  active_payment_option: observable,
  active_payment_option_fees: observable,
  source_id: observable,

  webPayments:observable,
  cardPayments:observable,
  isLoading: observable,
  selected_card: observable,
  card_wallet: observable,
  save_card_option: observable,
  three_d_Secure: observable,
  /*from here*/
  currency: observable,
  amount: observable,
  customer: observable,
  redirectURL:observable,
  metadata: observable,
  charge_id: observable,
  authorize_id: observable,
  ref: observable,
  tranx_desc: observable,
  receipt: observable,
  transaction: observable,
  cardToken: observable,
  status_display_duration: observable,
  otp_resend_interval: observable,
  otp_resend_attempts: observable,
  authenticate: observable,
  authorize: observable,
  charge:observable,
});

export default PaymentStore;
