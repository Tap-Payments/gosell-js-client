import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

//include all the
class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.config = null;
    this.key = null;
    this.gateway = null;

    this.contactInfo = true;

    this.language = 'en';
    this.labels = {};

    this.btn = null;

    this.style = {
      base: {
        color: '#535353',
        lineHeight: '18px',
        fontFamily: this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
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
    this.tranx_description = null;
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

    this.legalConfig = false;

    this.notifications = 'standard';

    this.view = '';
  }

  callbackFunc(data){
    if(this.RootStore.configStore.gateway.callback){
      this.RootStore.configStore.gateway.callback(data);
    }
  }
  unSetGlobalStyle(){
    let styleChild = document.getElementsByClassName('goSellJSLibCSS')[0]
    if (styleChild){
      styleChild.parentNode.removeChild(styleChild);
    }
  }

  setGlobalStyle(){
    this.unSetGlobalStyle()
    console.log(head);
    const arCss = "*{font-family: 'Helvetica-Light', sans-serif; line-height: 1.2;}"
    const enCss = "*{font-family: 'Roboto-Light', sans-serif;}"
    const css = this.language.toLowerCase()=='ar'?  arCss : enCss
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    style.className = 'goSellJSLibCSS'
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.prepend(document.createTextNode(css));
    }
    head.prepend(style);
  }
  
  setConfig(value, view){
      console.log('set setConfig');

      this.config = value;
      this.key = value.gateway ? value.gateway.publicKey : null;

      this.view = view;
      this.language = value.gateway.language ? value.gateway.language : 'en';

      this.language === 'en' ? require('../assets/css/fontsEn.css') : require('../assets/css/fontsAr.css');

      this.style.base.fontFamily = this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',

      this.RootStore.localizationStore.getLocalization().then(result => {
        if(result.status == 200){
          this.labels = {
              cardNumber:this.RootStore.localizationStore.getContent('card_input_card_number_placeholder', null),
              expirationDate:this.RootStore.localizationStore.getContent('card_input_expiration_date_placeholder', null),
              cvv:this.RootStore.localizationStore.getContent('card_input_cvv_placeholder', null),
              cardHolder:this.RootStore.localizationStore.getContent('card_input_cardholder_name_placeholder', null)
          }
          this.btn = this.RootStore.localizationStore.getContent('btn_pay_title_generic', null);
        }
      });
  }

  async configure(){
    var self = this;
    var value = this.config;

    if(value.gateway){
      if(window.location.protocol=='http:' && value.gateway && value.gateway.publicKey.indexOf("pk_live") == 0){
        console.log('error setConfig');
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_https_configration_msg', null), this.RootStore.localizationStore.getContent('gosell_https_configration_submsg', null));
        this.legalConfig = false;
      }
      else {

        if(value.gateway != null){
          this.gateway = value.gateway;

          this.language = value.gateway.language ? value.gateway.language : 'en';

          // console.log('supportedCurrencies', value.gateway.supportedCurrencies);
          // console.log('type', typeof value.gateway.supportedCurrencies);

          if(value.gateway.supportedCurrencies){
            if(typeof value.gateway.supportedCurrencies == 'object'){
              var currencies = [];
              value.gateway.supportedCurrencies.forEach(function(c){
                currencies.push(c.toUpperCase());
              });

              this.gateway.supportedCurrencies = currencies;
            }
            else {
              this.gateway.supportedCurrencies = value.gateway.supportedCurrencies.toLowerCase();
            }
          }
          else {
            this.gateway.supportedCurrencies = 'all';
          }

          if(value.gateway.supportedPaymentMethods){
            if(typeof value.gateway.supportedPaymentMethods == 'object'){
              var methods = [];
              value.gateway.supportedPaymentMethods.forEach(function(c){
                methods.push(c.toUpperCase());
              });

              this.gateway.supportedPaymentMethods = methods;
            }
            else {
              this.gateway.supportedPaymentMethods = value.gateway.supportedPaymentMethods.toLowerCase();
            }
          }
          else {
            this.gateway.supportedPaymentMethods = 'all';
          }

          if(value.gateway.saveCardOption != undefined){
            this.gateway.saveCardOption = value.gateway.saveCardOption;
          }
          else {
            this.gateway.saveCardOption = true;
          }

          if(value.gateway.customerCards != undefined){
            this.gateway.customerCards = value.gateway.customerCards;
          }
          else {
            this.gateway.customerCards = true;
          }

          if(value.gateway.labels && value.gateway.labels.actionButton){
            this.btn = value.gateway.labels.actionButton;
          }
          else {
            if(this.transaction_mode === 'save_card'){
              this.btn = this.RootStore.localizationStore.getContent('btn_save_title', null);
            }
          }

          if(value.gateway.labels){
            this.labels = {
              cardNumber: value.gateway.labels.cardNumber ? value.gateway.labels.cardNumber : this.RootStore.localizationStore.getContent('card_input_card_number_placeholder', null),
              expirationDate: value.gateway.labels.expirationDate ? value.gateway.labels.expirationDate : this.RootStore.localizationStore.getContent('card_input_expiration_date_placeholder', null),
              cvv: value.gateway.labels.cvv ? value.gateway.labels.cvv : this.RootStore.localizationStore.getContent('card_input_cvv_placeholder', null),
              cardHolder: value.gateway.labels.cardHolder ? value.gateway.labels.cardHolder : this.RootStore.localizationStore.getContent('card_input_cardholder_name_placeholder', null)
            };
          }
          console.log('font', this.language === 'en' ? "'Roboto-Light', sans-serif" : "'Helvetica-Light', sans-serif");
          if(value.gateway.style && isEmpty(value.gateway.style)){
            this.style = {
              base: value.gateway.style.base && isEmpty(value.gateway.style.base) ? value.gateway.style.base : {
                color: '#535353',
                lineHeight: '18px',
                fontFamily: this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
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

          return await this.tranxConfig(value);

        }
        else {
          console.log("Something went wrong! Please check the goSell configration");
          this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
          this.legalConfig = false;
        }

    }
  }
  else {
    console.log("Something went wrong! Please check the goSell configration");
    this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
    this.legalConfig = false;
  }

    console.log('transaction_mode', this.transaction_mode);

    console.log('legal finally!!!', this.legalConfig);
  }

  async tranxConfig(value){

    var self = this;

    var URLSearchParams = require('url-search-params');

    var urlParams = new URLSearchParams(window.location.search);

    if(!urlParams.has('tap_id')){
      if(value.charge && value.charge != null){
        this.transaction_mode = 'charge';

        return await this.chargeDetails(value);

      }
      else if(value.authorize && value.authorize != null){
        this.transaction_mode = 'authorize';

        return await this.authorizeDetails(value);
      }
      else if(value.saveCard){
        this.transaction_mode = 'save_card';
        this.saveCard = value.saveCard;

        this.tranx_description = null;

        if(value.order || value.order != null){
          this.order = {currency: value.order.currency, amount: value.order.amount};
        }

        if(value.customer || value.customer != null){
          this.customer = value.customer;

          self.legalConfig = true;

          return await self.legalConfig;
        }
        else {
          this.legalConfig = false;
          console.log("Something went wrong! Please check the customer details");
          this.RootStore.uIStore.showMsg('warning',this.RootStore.localizationStore.getContent('gosell_customer_configration_msg', null), null);

          return await self.legalConfig;
        }
      }
      else if(value.token){
        this.transaction_mode = 'get_token';
        this.tranx_description = null;

        this.token = value.token;
        if(value.order || value.order != null){
          this.order = {currency: value.order.currency, amount: value.order.amount};
        }

        self.legalConfig = true;
        return await self.legalConfig;

      }
      else {
        this.legalConfig = false;
        console.log("Something went wrong! Please check the goSell configration");
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);

        return await self.legalConfig;
      }
    }
  }

  async chargeDetails(value){

    var self = this;

    if(value.charge.id){
      console.log(value.charge.id);

      await this.RootStore.apiStore.getTransaction(value.charge.id).then(async result => {
        console.log('get charge transaction response', result);
        self.redirect_url = result.data.redirect.url;

        self.order = {currency: result.data.currency, amount: result.data.amount};
        self.customer = result.data.customer;

        self.charge = {
          saveCard:  result.data.save_card,
          threeDSecure:  result.data.threeDSecure,
          description:  result.data.description,
          statement_descriptor:  result.data.statement_descriptor,
          reference:  result.data.reference,
          metadata:  result.data.metadata,
          receipt:  result.data.receipt,
          redirect:  result.data.redirect.url,
          post:  result.data.post.url
        };

        console.log("order is: ", this.order);

        self.tranx_description = self.charge.description;

        self.RootStore.paymentStore.charge = self.charge;

        self.legalConfig = true;

        return await self.legalConfig;

      });

    }else {

      this.charge = value.charge;

      self.tranx_description = self.charge.description;

      this.redirect_url = value.charge.redirect;
      this.RootStore.paymentStore.charge = this.charge;

      if(value.customer || value.customer != null){
        this.customer = value.customer;
      }

      if(value.order || value.order != null){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};

        this.legalConfig = true;
        return await this.legalConfig;

      }
      else {
        this.legalConfig = false;
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_order_configration_msg', null), null);

        return await this.legalConfig;
      }

    }

  }

  async authorizeDetails(value){

    var self = this;

    if(value.authorize.id){
      console.log(value.authorize.id);

      await this.RootStore.apiStore.getTransaction(value.authorize.id).then(async result => {
        console.log('get authorize transaction response', result);
        self.redirect_url = result.data.redirect.url;

        self.order = {currency: result.data.currency, amount: result.data.amount};
        console.log('order ++++++ ', self.order);
        self.customer = result.data.customer;

        self.authorize = {
          auto: result.data.auto,
          saveCard:  result.data.save_card,
          threeDSecure:  result.data.threeDSecure,
          description:  result.data.description,
          statement_descriptor: result.data.statement_descriptor,
          reference: result.data.reference,
          metadata: result.data.metadata,
          receipt: result.data.receipt,
          redirect: result.data.redirect.url,
          post: result.data.post.url
        };

        self.tranx_description = self.authorize.description;

        self.RootStore.paymentStore.authorize = self.authorize;

        self.legalConfig = true;

        return await self.legalConfig;
      });

    }else {
      this.authorize = value.authorize;

      self.tranx_description = self.authorize.description;
      console.log('authorize', this.authorize);
      this.redirect_url = value.authorize.redirect;

      if(value.customer || value.customer != null){
        this.customer = value.customer;
      }

      if(value.order || value.order != null){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};

        self.legalConfig = true;

        return await self.legalConfig;
      }
      else {
        this.legalConfig = false;
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_order_configration_msg', null), null);

        return await self.legalConfig;
      }
    }
  }
}


function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}

decorate(ConfigStore, {
  gateway: observable,
  key: observable,
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
  view:observable,
  contactInfo: observable,
  tranx_description: observable
});

export default ConfigStore;
