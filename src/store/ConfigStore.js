import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
import Paths from '../../webpack/paths';

// let defaults = {
//   language: 'en',
//   country: 'kw'
// }

class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.reset();
    // this.defaults['language']
  }

  reset(){
    this.config = null;
    this.key = null;
    this.gateway = {
      contactInfo:true,
      customerCards:true,
      language:'en',
      notifications:'standard',
      saveCardOption:true,
      supportedCurrencies:'all',
      supportedPaymentMethods:'all'
    };

    this.contactInfo = true;

    this.language = 'en';
    this.labels = {};

    this.btn = null;

    this.style = {
      base:{
        color: '#535353',
        lineHeight: '18px',
        fontFamily: this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
        fontUrl: this.language === 'en' ? Paths.cssPath + 'fontsEn.css' : Paths.cssPath + 'fontsAr.css',
        fontSmoothing: 'antialiased',
        fontSize:'15px',
        '::placeholder': {
          color: 'rgba(0, 0, 0, 0.26)',
          fontSize:this.language === 'en' ? '15px' : '10px'
        }
      },
      invalid:{
        color: 'red',
        iconColor: '#fa755a '
      }
    };

    this.transaction_mode = null;
    this.tranx_description = null;
    this.customer = null;
    this.transaction = null;

    this.order = null;

    this.items = null;
    this.shipping = null;
    this.taxes = null;

    this.redirect_url = null;

    this.legalConfig = true;

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
      setTimeout(function(){
        if(styleChild){
          styleChild.parentNode.removeChild(styleChild);
        }
      }, 1000);
    }
  }

  setGlobalStyle(){
    this.unSetGlobalStyle();
    // console.log(head);
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
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  setConfig(value, view){

    this.config = value;
    this.view = view;

    this.key = value.gateway ? value.gateway.publicKey : null;

    this.language = value.gateway && value.gateway.language ? value.gateway.language : 'en';
    this.language === 'en' ? require('../assets/css/fontsEn.css') : require('../assets/css/fontsAr.css');
  }

  async configure(){

    this.transaction_mode = this.config.transaction ? this.config.transaction.mode : null;

    switch (this.transaction_mode) {
      case 'charge':
        await this.setGateway(this.config);
        await this.setCustomer(this.config);
        await this.setTransaction(this.config.order, this.config.transaction.charge).then(async result => {
          console.log('result', result);
          this.legalConfig = result;
        });
        break;
      case 'authorize':
        await this.setGateway(this.config);
        await this.setCustomer(this.config);
        await this.setTransaction(this.config.order, this.config.transaction.authorize).then(async result => {
          console.log('result', result);
          this.legalConfig = result;
        });
        break;
      case 'save_card':
        this.btn = this.RootStore.localizationStore.getContent('btn_save_title', null);
        this.legalConfig = true;
        break;
      case 'token':
        this.legalConfig = true;
        break;
      default:
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
        this.legalConfig = false;
        break;
    }

    // console.log('_return', this.legalConfig);
    return await this.legalConfig;
  }

  setOrder(value){
    console.log('from set order', value);
    if(this.legalConfig && (value || value != null)){
      this.order = value;
      this.items = value.items ? value.items.slice() : null;
      this.shipping = value.shipping ? value.shipping : null;
      this.taxes = value.taxes ? value.taxes : null;
      console.log('this.legalConfig1', this.legalConfig);

      this.legalConfig = true;

      console.log('this.legalConfig2', this.legalConfig);
    }
    else if(this.transaction_mode != 'token' && this.transaction_mode != 'save_card'){
      this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_order_configration_msg', null), null);
      this.legalConfig = false;
    }

    return this.legalConfig;
  }

  setCustomer(value){

    if(this.legalConfig && (value.customer || value.customer != null)){
      this.customer = value.customer;
    }
    else if(this.transaction_mode === 'save_card'){
      this.legalConfig = false;
      this.RootStore.uIStore.showMsg('warning',this.RootStore.localizationStore.getContent('gosell_customer_configration_msg', null), null);
    }
  }

  setGateway(value){

    if(this.legalConfig && (value.gateway && value.gateway != null)){
        if(window.location.protocol=='http:' && value.gateway && value.gateway.publicKey.indexOf("pk_live") == 0){
          // console.log('error setConfig');
          this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_https_configration_msg', null), this.RootStore.localizationStore.getContent('gosell_https_configration_submsg', null));
          this.legalConfig = false;
        }
        else {

          if(value.gateway && value.gateway != null &&  value.gateway.publicKey){
            this.gateway = value.gateway;

            this.RootStore.uIStore.dir = this.language === 'ar' ? 'rtl' : 'ltr';

            // this.style.base.fontSize = this.language === 'en' ? '15px' : '10px';
            this.style.base.fontFamily = this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light';
            this.style.base.fontUrl = this.language === 'en' ? Paths.cssPath + 'fontsEn.css' : Paths.cssPath + 'fontsAr.css';

            this.contactInfo = !(value.gateway.contactInfo) ? value.gateway.contactInfo : this.contactInfo;

            this.language = value.gateway.language ? value.gateway.language : 'en';

            this.RootStore.uIStore.dir = this.language === 'ar' ? 'rtl' : 'ltr';

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

            this.gateway.saveCardOption = value.gateway.saveCardOption;
            this.gateway.customerCards = value.gateway.customerCards;

            if(value.gateway.labels && value.gateway.labels.actionButton){
              this.btn = value.gateway.labels.actionButton;
            }
            else {

              if(this.transaction_mode === 'save_card'){
                this.btn = this.RootStore.localizationStore.getContent('btn_save_title', null);
              }
              else {
                this.btn = this.RootStore.localizationStore.getContent('btn_pay_title_generic', null);
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
            else {
              this.labels = {
                  cardNumber:this.RootStore.localizationStore.getContent('card_input_card_number_placeholder', null),
                  expirationDate:this.RootStore.localizationStore.getContent('card_input_expiration_date_placeholder', null),
                  cvv:this.RootStore.localizationStore.getContent('card_input_cvv_placeholder', null),
                  cardHolder:this.RootStore.localizationStore.getContent('card_input_cardholder_name_placeholder', null)
              }
            }
            if(value.gateway.style && isEmpty(value.gateway.style)){
              this.style = {
                base: value.gateway.style.base && isEmpty(value.gateway.style.base) ? value.gateway.style.base : {
                  color: '#535353',
                  lineHeight: '18px',
                  fontFamily: this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
                  fontUrl: this.language === 'en' ? Paths.cssPath + 'fontsEn.css' : Paths.cssPath + 'fontsAr.css',
                  fontSmoothing: 'antialiased',
                  fontSize: '15px',
                  '::placeholder': {
                    color: 'rgba(0, 0, 0, 0.26)',
                    fontSize:this.language === 'en' ? '15px' : '10px'
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
            this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
            this.legalConfig = false;
          }

      }
    }
    else {
      this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
      this.legalConfig = false;
    }

  }

  async setTransaction(order, value){

    var self = this;

    if(this.legalConfig && value){
      if(value.id){
        await this.RootStore.apiStore.getTransaction(value.id).then(result => {
          console.log('get charge transaction response', result);

          self.redirect_url = result.data.redirect.url;

          self.customer = result.data.customer;

          self.transaction = {
            id: value.id,
            auto: result.data.auto ? result.data.auto : null,
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

          self.RootStore.paymentStore.transaction = self.transaction;

          // console.log("order is: ", this.order);

          self.tranx_description = self.transaction.description;

          var orderDetails = {
              currency: result.data.currency,
              amount: result.data.amount
          };

          self.legalConfig = self.setOrder(orderDetails);

        });



      }else {

        self.transaction = value;

        self.RootStore.paymentStore.transaction = self.transaction;

        console.log('this.transaction', this.transaction);

        self.tranx_description = self.transaction.description;

        self.redirect_url = value.redirect;


        self.legalConfig = self.setOrder(order);

      }
    }
    else {
        console.log("Something went wrong! Please check the goSell configration");
        this.RootStore.uIStore.showMsg('warning', this.RootStore.localizationStore.getContent('gosell_gateway_configration_msg', null), null);
        this.legalConfig = false;
    }

    return await this.legalConfig;

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
  transaction: observable,
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
