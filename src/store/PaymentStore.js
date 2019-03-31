import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class PaymentStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.payment_methods = {};
    this.current_amount = 0;
    this.current_currency = {};
    this.settlement_currency = null;
    this.old_currency = null;

    //gcc currrencies list
    this.gcc = ["BHD", "SAR", "AED", "OMR", "QAR", "KWD"];

    // currencies list from config store.
    this.currencies = [];

    //supported currenices for the selected payment methods
    this.supported_currencies_based_on_methods = [];

    //filtered list of supported currencies
    this.supported_currencies = {};
    this.filtered_currencies = {};

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

    this.transaction = null;

    //otp
    this.status_display_duration = 0;
    this.otp_resend_interval = 0;
    this.otp_resend_attempts = 0;

    this.authenticate = null;

    // card token details
    this.active_payment_option = null;
    this.active_payment_option_fees = 0;
    this.active_payment_option_total_amount = 0;
    this.source_id = null;

    this.charge = null;

    this.supported_payment_methods = null;

    this.confirmExchangeCurrency = this.confirmExchangeCurrency.bind(this);
    this.cancelExchangeCurrency = this.cancelExchangeCurrency.bind(this);


  }

  setThreeDSecure(value){
    var self = this;

    // if(value){
    //   switch (self.RootStore.configStore.transaction_mode) {
    //     case "charge":
    //       self.three_d_Secure = self.RootStore.configStore.charge.threeDSecure;
    //       break;
    //     case "authorize":
    //       self.three_d_Secure = self.RootStore.configStore.authorize.threeDSecure;
    //       break;
    //     default:
          self.three_d_Secure = value;
      // }
    // }

  }

  setCards(value){
    // console.log('customer card', this.RootStore.configStore.gateway.customerCards);
    if(this.RootStore.configStore.gateway.customerCards){
      this.customer_cards = value;
      this.customer_cards_by_currency = this.savedCardsByCurrency;
    }

  }

  getFees(value){
    var self = this;
    // console.log('99 payment methods in getFee', self.payment_methods);
    var active = self.payment_methods.filter(function(payment){
        // console.log('99 '+ value, payment.name);
        // console.log('99 payment', payment);
        // console.log('99 what is the problem?????????? ', value.indexOf(payment.name));
        try{
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
        }
        catch(error){
          console.log('error', error);
        }
      return payment;
    });

    self.active_payment_option = active[0];
    // console.log('99 self.active_payment_option', self.active_payment_option);
    // console.log('99 active_payment_option_fees', self.active_payment_option_fees);
    // console.log('99 active_payment_option_total_amount', self.active_payment_option_total_amount);
  }

  calcExtraFees(fees){
    var self = this;
    var total_fees = 0;

    fees.forEach(function(fee){
      var extra_fee = 0;

      // console.log('fee object', fee);
      if(fee.type.toUpperCase() === "P"){
        // console.log('it is p');
        extra_fee +=  self.current_currency.amount * fee.value / 100;
        // console.log('fee', extra_fee);
      }
      else {
        if(self.settlement_currency.currency == self.current_currency.currency){
          // console.log('it is f 1');
          extra_fee += fee.value;
        }
        else {
          // console.log('it is f 2');
          var rate = self.settlement_currency.amount / self.current_currency.amount;
          // console.log('rate', rate);
          //convert the amount first
          extra_fee +=  fee.value * rate;
          // console.log('fee', extra_fee);
        }
      }

      total_fees += extra_fee;

    });
    return total_fees;
  }

  getPaymentMethods(data, currency, customer_cur){

    if(data != null){

      console.log('v customer_currency', customer_cur);

      // data = JSON.parse(data);
      this.setPaymentMethods(data.payment_methods);
      this.setSupportedCurrencies(data.supported_currencies);

      // console.log('customerCards: ', this.RootStore.configStore.gateway.customerCards);
      if(this.RootStore.configStore.gateway.customerCards){
        // console.log('set cards', data.cards);
        this.setCards(data.cards);
      }

      this.sort();

      if(this.RootStore.configStore.transaction_mode === 'save_card' || this.RootStore.configStore.transaction_mode === 'token'){
        this.supported_currencies = this.setFormSupportedCurrencies(data.supported_currencies);
      }

      var self = this;

      var methods_currencies = this.supported_currencies_based_on_methods;
      // console.log('methods', methods_currencies);

      if(this.supported_currencies && Array.isArray(this.supported_currencies.slice()) && this.supported_currencies.length > 0){
        // console.log('hey', self.supported_currencies.slice().length);

        if(methods_currencies.length <= 1){
          self.setCurrentCurrency(self.supported_currencies[0]);
          self.current_amount = self.supported_currencies[0].amount;
          self.customer_cards_by_currency = self.savedCardsByCurrency;
          self.RootStore.configStore.order = self.supported_currencies[0];

          if(self.supported_currencies[0].currency == data.settlement_currency){
            self.settlement_currency = self.supported_currencies[0];
          }

          self.isLoading = false;
        }
        else if(methods_currencies.length > 1){

          var merchant_currency, customer_currency = null;

          self.supported_currencies.filter(function(el){
              if(currency.indexOf(el.currency) >= 0){
                console.log('v merchant currency is: ', el);
                merchant_currency = el;
              }

              if(customer_cur.code != null && customer_cur.code.indexOf(el.currency) >= 0){
                console.log('v customer currency is: ', el);
                customer_currency = el;
              }

              if(el.currency == data.settlement_currency){
                self.settlement_currency = el;
              }

          });


          self.setCurrentCurrency(merchant_currency);
          self.current_amount = merchant_currency.amount;
          self.customer_cards_by_currency = self.savedCardsByCurrency;
          self.RootStore.configStore.order = merchant_currency;

          self.isLoading = false;

          if(customer_currency != null && customer_currency.currency != merchant_currency.currency){

            var currency_name = this.RootStore.localizationStore.getContent('supported_currencies_title_'+customer_currency.currency.toLowerCase(), null);

            this.RootStore.uIStore.setErrorHandler({
              visable: true,
              type: 'warning',
              code: 'Exchange Currency',
              msg: this.RootStore.localizationStore.getContent('exchange_currency_message', null).replace('%@', currency_name),
              options: [
                {title: this.RootStore.localizationStore.getContent('alert_cancel_payment_status_undefined_btn_confirm_title', null), action: this.confirmExchangeCurrency.bind(this, customer_currency)},
                {title: '×', action: this.cancelExchangeCurrency.bind(this)},
              ]
            });
          }

          // self.supported_currencies.forEach(function(cur){
          //
          //   if(cur.currency === currency){
          //       self.setCurrentCurrency(cur);
          //       self.current_amount = cur.amount;
          //       self.customer_cards_by_currency = self.savedCardsByCurrency;
          //       self.RootStore.configStore.order = cur;
          //
          //       self.isLoading = false;
          //   }
          //
          //   if(cur.currency == data.settlement_currency){
          //     self.settlement_currency = cur;
          //   }
          //
          // });
        }
        else {
          this.isLoading = true;
          this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
        }


      }
      else {
        this.isLoading = true;
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
      }
    }
  }

  confirmExchangeCurrency(customer_currency){
    this.setCurrentCurrency(customer_currency);
  }

  cancelExchangeCurrency(){
    this.RootStore.uIStore.setErrorHandler({});
  }

  setPaymentMethods(value){
    var self = this;

    this.payment_methods = {};
    this.supported_payment_methods = this.RootStore.configStore.gateway.supportedPaymentMethods;

    if(typeof this.supported_payment_methods === 'object' || Array.isArray(this.supported_payment_methods.slice())){

      self.payment_methods = value.filter(function(el){
        return self.supported_payment_methods.indexOf(el.name) >= 0;
      });
    }
    else if(this.supported_payment_methods == 'all'){
      self.payment_methods = value;
    }
    else {
      self.isLoading = true;
      self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
    }

    self.payment_methods.filter(function(el){
      el.supported_currencies.forEach(function(cur){
        if(self.supported_currencies_based_on_methods.indexOf(cur) < 0){
          self.supported_currencies_based_on_methods.push(cur)
        }
      });
    });
  }

  computed
  get getWebPaymentsByCurrency(){
    var self = this;

    if(Array.isArray(this.webPayments.slice())){
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

    if(Array.isArray(this.cardPayments.slice())){
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

  computed
  get savedCardsByCurrency(){
    var self = this;

    if(this.cardPayments && (Array.isArray(this.cardPayments.slice()) && this.cardPayments.length > 0)
      && this.customer_cards && (Array.isArray(this.customer_cards.slice()) && this.customer_cards.length > 0)){
      var arr = [];
      this.customer_cards.forEach(function(card){
        var curs = card.supported_currencies;
        // console.log('card', card.brand);

        for(var i = 0; i < curs.length; i++){
          if(curs[i] === self.current_currency.currency){
            if(Array.isArray(self.supported_payment_methods.slice())){
              for(var j = 0; j < self.supported_payment_methods.slice().length; j++){
                if(card.brand === self.supported_payment_methods[j]){
                  arr.push(card);
                }
              }

            }
            else {
              arr.push(card);
            }
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
    if(Array.isArray(this.cardPayments.slice()) && this.cardPayments.length > 0){
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

    if(this.current_currency.currency != undefined){
      this.old_currency = this.current_currency.currency;
    }
    else {
      this.old_currency = value.currency;
    }

    this.current_currency = value;
    this.customer_cards_by_currency = this.savedCardsByCurrency;
    this.active_payment_option_total_amount = value.currency;

    if(this.RootStore.formStore.card != null){
      this.RootStore.formStore.switchCurrency(value);
      // this.RootStore.formStore.clearCardForm();
      this.RootStore.uIStore.setErrorHandler({});
    }
  }

  setSupportedCurrencies(value){
    var self = this;
    this.supported_currencies = {};
    var config_currencies = this.RootStore.configStore.gateway.supportedCurrencies;
    // console.log('ccc', config_currencies);
    if(typeof config_currencies == 'object' && Array.isArray(config_currencies.slice())){
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
          self.currencies = value;
          self.supported_currencies = value;
          break;
      }
      // console.log('cccc', self.currencies);
    }

    var methods_currencies = this.supported_currencies_based_on_methods;

    value = self.supported_currencies;

    self.supported_currencies = value.filter(function(el){
        return methods_currencies.indexOf(el.currency) >= 0;
    });

  }

  //supported currencies based on cards list (saveCard & token modes only)
  setFormSupportedCurrencies(value){
    // console.log('this.cardPayments', this.cardPayments);
    var self = this;

    if(Array.isArray(this.cardPayments.slice())){
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

  // sort(){
  //
  //   this.webPayments = [];
  //   this.cardPayments = [];
  //   if(Array.isArray(this.payment_methods.slice())){
  //     var self = this;
  //
  //     this.payment_methods.forEach(function(method) {
  //       if(method.payment_type === 'web'){
  //         self.webPayments.push(method);
  //         //self.charge(method.source_id);
  //       }
  //
  //       if(method.payment_type === 'card'){
  //         self.cardPayments.push(method);
  //       }
  //
  //     });
  //
  //   }
  //
  // }

  sort(){

    this.webPayments = [];
    this.cardPayments = [];

    if(this.payment_methods && this.payment_methods.slice().length > 0){

      // console.log('**** in sort payment methods', this.payment_methods);
      var self = this;

      this.payment_methods = this.payment_methods.slice();

      var method = null;

      for(var i = 0; i < this.payment_methods.length; i++){
        method = this.payment_methods[i];

        // console.log('**** method', method);
        // console.log('**** method', method.payment_type);

        try{
          if(method.payment_type == 'web'){
            this.webPayments.push(method);

          } else if(method.payment_type == 'card'){
            this.cardPayments.push(method);
          }
        }
        catch(err) {
          console.log('error', err)
        }

        // console.log('**** web payments', this.webPayments);
        // console.log('**** card payments', this.cardPayments);

      }
    }

  }

  saveCardOption(value){

    if(this.save_card_active && this.card_wallet){
      this.save_card_option = value;
      // console.log('save_card_option',this.save_card_option);
    }
    else {
      this.save_card_option = false;
    }

    // console.log('save_card_active', this.save_card_active);
    // console.log('card_wallet',this.card_wallet);
    // console.log('save_card_option', this.save_card_option);

  }

  computed
  get getCurrentValue(){

    let old = this.RootStore.configStore.order;
    let current =  this.RootStore.paymentStore.current_currency;

    var title = {'main': this.getMainAmount};

    if(current.currency !== old.currency){
          title = {'main': this.getCurrentAmount, 'secondary': this.getMainAmount}
    }

    // console.log('title', title);

    return title;
  }

  computed
  get getMainAmount(){
    let old = this.RootStore.configStore.order;
    let old_amount = this.RootStore.uIStore.formatNumber(old.amount.toFixed(old.decimal_digit));


    var old_symbol = this.RootStore.localizationStore.getContent('supported_currencies_symbol_' + old.currency.toLowerCase(), null);

    if(this.RootStore.uIStore.dir === 'rtl'){
      return old_amount + ' ' + old_symbol;
    }
    else {
      return old_symbol + old_amount;
    }
  }

  computed
  get getCurrentAmount(){
    let current =  this.RootStore.paymentStore.current_currency;
    let new_amount = this.RootStore.uIStore.formatNumber(current.amount.toFixed(current.decimal_digit));

    var new_symbol = this.RootStore.localizationStore.getContent('supported_currencies_symbol_' + current.currency.toLowerCase(), null);

    if(this.RootStore.uIStore.dir === 'rtl'){
      return new_amount + ' ' + new_symbol;
    }
    else {
      return new_symbol + new_amount;
    }

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
  old_currency: observable,
  supported_payment_methods: observable
});


export default PaymentStore;
