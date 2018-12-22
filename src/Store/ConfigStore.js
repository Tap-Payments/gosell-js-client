import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

//include all the
class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.config = null;
    this.gateway = null;

    this.language = 'en';
    this.labels = {
      cardNumber:"Card Number",
      expirationDate:"MM/YY",
      cvv:"CVV",
      cardHolder:"Name on Card"
    };

    this.btn = "Pay";

    this.style = {
      base: {
        color: '#535353',
        lineHeight: '18px',
        fontFamily: 'sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(0, 0, 0, 0.26)',
          fontSize:'15px'
        }
      },
      invalid: {
        color: 'red',
        iconColor: '#fa755a '
      }
    };

    this.transaction_mode = null;
    this.customer = null;

    this.charge = null;
    this.authorize = null;
    this.saveCard = null;
    this.token = null;

    this.order = null;

    this.items = null;
    this.shipping = null;
    this.taxes = null;

    this.redirect_url = null;

    this.legalConfig = true;

    this.notifications = 'standard';

  }

  setConfig(value){
    this.config = value;
  }

  configure(){
    var value = this.config;

    if(value.charge){
      this.transaction_mode = 'charge';
      this.charge = value.charge;

      this.redirect_url = value.charge.redirect;
      this.RootStore.paymentStore.charge = this.charge;

      if(value.order || value.order != null){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }
      else {
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the order details", null);
        this.legalConfig = false;
      }

      if(value.customer || value.customer != null){
        this.customer = value.customer;
      }
      else {
        console.log("Something went wrong! Please check the customer details");
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the customer details", null);
        this.legalConfig = false;
      }
    }
    else if(value.authorize){
      this.transaction_mode = 'authorize';
      this.authorize = value.authorize;
      this.redirect_url = value.authorize.redirect;

      if(value.order || value.order != null){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }
      else {
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the order details", null);
        this.legalConfig = false;
      }

      if(value.customer || value.customer != null){
        this.customer = value.customer;
      }
      else {
        console.log("Something went wrong! Please check the customer details");
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the customer details", null);
        this.legalConfig = false;
      }
    }
    else if(value.saveCard){
      this.transaction_mode = 'save_card';
      this.saveCard = value.saveCard;

      if(value.order || value.order != null){
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }
      else {
        this.order = {currency: 'KWD', amount: 0};
      }

      if(value.customer || value.customer != null){
        this.customer = value.customer;
      }
      else {
        console.log("Something went wrong! Please check the customer details");
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the customer details", null);
        this.legalConfig = false;
      }
    }
    else if(value.token){
      this.transaction_mode = 'get_token';
      this.token = value.token;
      if(value.order || value.order != null){
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }
      else {
        this.order = {currency: 'KWD', amount: 0};
      }
    }
    else {
      console.log("Something went wrong! Please check the goSell configration");
      this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the goSell configration", null);
      this.legalConfig = false;
    }


    if(value.gateway){
      if(value.gateway != null){
        this.gateway = value.gateway;

        this.language = value.gateway.language ? value.gateway.language : 'en';

        if(value.gateway.labels && value.gateway.labels.actionButton){
          this.btn = value.gateway.labels.actionButton;
        }
        else {
          if(this.transaction_mode === 'save_card'){
            this.btn = 'Save';
          }
        }

        this.labels = {
          cardNumber: value.gateway.labels.cardNumber ? value.gateway.labels.cardNumber : "Card Number",
          expirationDate: value.gateway.labels.expirationDate ? value.gateway.labels.expirationDate : "MM/YY",
          cvv: value.gateway.labels.cvv ? value.gateway.labels.cvv : "CVV",
          cardHolder: value.gateway.labels.cardHolder ? value.gateway.labels.cardHolder : "Name on Card"
        };

        if(value.gateway.style && isEmpty(value.gateway.style)){
          this.style = {
            base: value.gateway.style.base && isEmpty(value.gateway.style.base) ? value.gateway.style.base : {
              color: '#535353',
              lineHeight: '18px',
              fontFamily: 'sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: 'rgba(0, 0, 0, 0.26)',
                fontSize:'15px'
              }
            },
            invalid: value.gateway.style.invalid && isEmpty(value.gateway.style.invalid) ? value.gateway.style.invalid : {
              color: 'red',
              iconColor: '#fa755a '
            }
          };
        }

        if(value.gateway.notifications && value.gateway.notifications !== 'standard'){
          this.notifications = value.gateway.notifications;
        }

      }
      else {
        console.log("Something went wrong! Please check the goSell configration");
        this.RootStore.uIStore.showResult('warning', "Something went wrong! Please check the goSell configration", null);
        this.legalConfig = false;
      }
    }

    console.log('transaction_mode', this.transaction_mode);
  }
}

function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}

decorate(ConfigStore, {
  gateway: observable,
  language:observable,
  labels:observable,
  btn:observable,
  style:observable,
  transaction_mode: observable,
  customer: observable,
  charge: observable,
  authorize: observable,
  saveCard: observable,
  token: observable,
  order: observable,
  items: observable,
  shipping: observable,
  taxes: observable,
  redirect_url:observable,
  legalConfig: observable,
  config: observable,
  notifications:observable,
});

export default ConfigStore;
