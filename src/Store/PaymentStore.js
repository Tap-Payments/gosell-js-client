import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class PaymentStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.payment_methods = {};
    this.current_amount = 0;
    this.current_currency = {};
    this.settlement_currency = null;
    this.gcc = ["BHD", "SAR", "AED", "OMR", "QAR", "KWD"];
    this.currencies = [];
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
    this.active_payment_option_total_amount = 0;
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
    console.log('from setCards func', value);
    this.customer_cards = value;
    this.customer_cards_by_currency = this.savedCardsByCurrency;
  }

  // getCardFees(value){
  //   var self = this;
  //   var active = self.payment_methods.filter(function(payment){
  //     if(value.indexOf(payment.name) >= 0){
  //       self.active_payment_option_fees = payment.extra_fees ? payment.extra_fees[0].value : 0;
  //       return payment;
  //     }
  //   });
  //
  //   self.active_payment_option = active[0];
  // }

  getFees(value){
    var self = this;
    console.log('payment methods in getFee', self.payment_methods);
    var active = self.payment_methods.filter(function(payment){
        console.log(value, payment.name);
        console.log('payment', payment);
        console.log('what is the problem?????????? ', value.indexOf(payment.name));
        if(value.indexOf(payment.name) >= 0){
          if(payment.extra_fees){
            var total_extra_fees = self.calcExtraFees(payment.extra_fees);
            self.active_payment_option_fees = total_extra_fees;
            self.active_payment_option_total_amount = self.current_currency.amount + self.active_payment_option_fees;
          }
          else{
            self.active_payment_option_fees = 0;
            self.active_payment_option_total_amount = self.current_currency.amount;
          }
        }
      return payment;
    });

    self.active_payment_option = active[0];
  }

  calcExtraFees(fees){
    var self = this;
    var total_fees = 0;

    fees.forEach(function(fee){
      var extra_fee = 0;

      console.log('fee object', fee);
      if(fee.type.toUpperCase() === "P"){
        console.log('it is p');
        extra_fee +=  self.current_currency.amount * fee.value / 100;
        console.log('fee', extra_fee);
      }
      else {
        if(self.settlement_currency.currency == self.current_currency.currency){
          console.log('it is f 1');
          extra_fee += fee.value;
        }
        else {
          console.log('it is f 2');
          var rate = self.settlement_currency.amount / self.current_currency.amount;
          console.log('rate', rate);
          //convert the amount first
          extra_fee +=  fee.value * rate;
          console.log('fee', extra_fee);
        }
      }

      total_fees += extra_fee;

    });
    return total_fees;
  }

  getPaymentMethods(data, currency){

    if(data != null){

      data = JSON.parse(data);
      this.setPaymentMethods(data.payment_methods);
      this.setSupportedCurrencies(data.supported_currencies);

      if(this.RootStore.configStore.gateway.customerCards){
        console.log('set cards', data.cards);
        this.setCards(data.cards);
      }

      this.sort();

      if(this.RootStore.configStore.transaction_mode === 'save_card' || this.RootStore.configStore.transaction_mode === 'token'){
        this.supported_currencies = this.setFormSupportedCurrencies(data.supported_currencies);
      }

      var self = this;
      console.log('settlement_currency >>>>>>>>> ', data.settlement_currency);

      if(Array.isArray(this.supported_currencies) && this.supported_currencies.length > 0){
        self.supported_currencies.forEach(function(cur){

          if(cur.currency === currency){
            //self.current_currency = cur;
            self.setCurrentCurrency(cur);
            self.current_amount = cur.amount;
            self.customer_cards_by_currency = self.savedCardsByCurrency;
            self.RootStore.configStore.order = cur;
          }

          if(cur.currency == data.settlement_currency){
            self.settlement_currency = cur;
          }
        });
      }

      console.log('settlement currency as object', this.settlement_currency);
      this.isLoading = false;
    }
  }

  setPaymentMethods(value){
    var self = this;

    this.payment_methods = {};
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
    this.active_payment_option_total_amount = value.currency;

    console.log('is it there? ', this.RootStore.formStore.card);

    if(this.RootStore.formStore.card != null){
      this.RootStore.formStore.switchCurrency(value);
      this.RootStore.formStore.clearCardForm();
      this.RootStore.uIStore.setErrorHandler({});
    }
  }

  setSupportedCurrencies(value){
    var self = this;
    this.supported_currencies = {};
    var config_currencies = this.RootStore.configStore.gateway.supportedCurrencies;

    if(typeof config_currencies === 'object' || Array.isArray(config_currencies)){
      self.currencies = config_currencies;
      self.supported_currencies = value.filter(function(el){
          return config_currencies.indexOf(el.currency) >= 0;
      });
    }
    else {
      switch (config_currencies){
        case 'all':
          self.currencies = 'all';
          self.supported_currencies = value;
          break;
        case 'gcc':
          self.currencies = self.gcc;
          self.supported_currencies = value.filter(function(el){
            return self.gcc.indexOf(el.currency) >= 0;
          });
          break;
        default:
          self.supported_currencies = value;
          break;
      }

      console.log('supported from set supported currencies', this.supported_currencies);
    }
  }

  setFormSupportedCurrencies(value){
    console.log('this.cardPayments', this.cardPayments);
    var self = this;

    if(Array.isArray(this.cardPayments)){
      var self = this;
      var arr = [];

      self.supported_currencies = value.filter(function(el){
        self.cardPayments.forEach(function(card){
          if(card.supported_currencies.indexOf(el.currency) == 0){

            arr.indexOf(el) === -1 ? arr.push(el) : null

          }
        });
      });

      return arr;
    }
    else {
      return null;
    }

    // self.supported_currencies = value.filter(function(el){
    //     return self.cardPayments.indexOf(el.currency) >= 0;
    // });
  }

  sort(){

    this.webPayments = [];
    this.cardPayments = [];
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

    console.log('save_card_active', this.save_card_active);
    console.log('card_wallet',this.card_wallet);

    if(this.save_card_active && this.card_wallet){
      this.save_card_option = true;
      console.log('save_card_option',this.save_card_option);
    }
    else {
      this.save_card_option = false;
    }
  }

  computed
  get getCurrentValue(){
    let old = this.RootStore.configStore.order;
    let current =  this.RootStore.paymentStore.current_currency;
    let old_amount = this.RootStore.uIStore.formatNumber(old.amount.toFixed(old.decimal_digit));
    let new_amount = this.RootStore.uIStore.formatNumber(current.amount.toFixed(current.decimal_digit));

    var title = {'main': old.symbol + ' ' + old_amount};

    if(current.currency !== old.currency){
        title = {'main': current.symbol + ' ' + new_amount, 'secondary': old.symbol + ' ' + old_amount}
    }

    return title;

  }

}

decorate(PaymentStore, {
  payment_methods: observable,
  current_currency: observable,
  current_amount: observable,
  settlement_currency: observable,
  supported_currencies: observable,
  currencies:observable,
  //customer cards list
  customer_cards: observable,
  customer_cards_by_currency: observable,

  active_payment_option: observable,
  active_payment_option_fees: observable,
  active_payment_option_total_amount: observable,
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
