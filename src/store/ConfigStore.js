import {decorate, observable} from 'mobx';
import Paths from '../../webpack/paths';

class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.reset();
  }

  reset(){
    this.config = null;
    this.gateway = {};
    this.language = 'en';

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

    this.token = null;
    this.notifications = 'standard';
    // this.legalConfig = true;
    this.redirect_url = null;
  }

  callbackFunc(data){
    // //console.log('hey ', data);
    if(this.RootStore.configStore.gateway.callback){
      this.RootStore.configStore.gateway.callback(data);
    }
  }
  

  setConfig(value){

    var self = this;

    this.config = value;

    this.config = Object.assign({}, value);
    this.config['location'] = {
      protocol: window.location.protocol,
      host: window.location.host,
      path: window.location.pathname
    }
    
    console.log('config', this.config);

    // this.gateway = value.gateway ? value.gateway : {};
    this.language = value.gateway && value.gateway.language ? value.gateway.language : 'en';
    console.log('language', this.language);

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

    this.style = {
      base: (value.gateway.style && value.gateway.style.base) ? value.gateway.style.base : {
        color: '#535353',
        lineHeight: '18px',
        fontFamily: this.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
        fontUrl: this.language === 'en' ? Paths.cssPath + 'fontsEn.css' : Paths.cssPath + 'fontsAr.css',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: 'rgba(0, 0, 0, 0.26)',
          fontSize:'15px'
        }
      },
      invalid: (value.gateway.style && value.gateway.style.invalid) ? value.gateway.style.invalid : {
        color: 'red',
        iconColor: '#fa755a '
      }
    };

    var gatewayObj = value.gateway ? {
      publicKey: value.gateway.publicKey ? value.gateway.publicKey : null,
      contactInfo: typeof value.gateway.contactInfo != 'undefined' ? value.gateway.contactInfo : true,
      customerCards: typeof value.gateway.customerCards != 'undefined' ? value.gateway.customerCards : true,
      language:value.gateway.language ? value.gateway.language : 'en',
      notifications:value.gateway.notifications ? value.gateway.notifications : 'standard',
      callback: value.gateway.callback ? value.gateway.callback : null,
      onClose: value.gateway.onClose ? value.gateway.onClose : null,
      backgroundImg: value.gateway.backgroundImg ? value.gateway.backgroundImg : null,
      saveCardOption: typeof value.gateway.saveCardOption != 'undefined' ? value.gateway.saveCardOption : true,
      supportedCurrencies: value.gateway.supportedCurrencies ? value.gateway.supportedCurrencies : 'all',
      supportedPaymentMethods: value.gateway.supportedPaymentMethods ? value.gateway.supportedPaymentMethods : 'all',
      labels: value.gateway.labels ? value.gateway.labels : this.labels,
      style: value.gateway.style ? value.gateway.style : this.style
    } : {};

    this.config.gateway = gatewayObj;
    this.gateway = gatewayObj;

    console.log('this.gateway', this.config.gateway);

    console.log('condition', window.location.protocol=='http:' && value.gateway && value.gateway.publicKey.indexOf("pk_live") == 0);
    console.log('protocol', window.location.protocol);
    console.log('value.gateway.publicKey.indexOf("pk_live")', value.gateway.publicKey.indexOf("pk_live"));
    console.log('window.location.protocol==http && value.gateway && value.gateway.publicKey.indexOf("pk_live") == 0',window.location.protocol=='http:' && value.gateway && value.gateway.publicKey.indexOf("pk_live") == 0);

      var transaction_mode = this.config.transaction ? this.config.transaction.mode : null;

      switch (transaction_mode) {
        case 'charge':
          self.redirect_url = self.config.transaction.charge ? self.config.transaction.charge.redirect : window.location.href;
          break;
        case 'authorize':
          self.redirect_url = self.config.transaction.authorize ? self.config.transaction.authorize.redirect : window.location.href;
          break;
      }

      this.notifications = value.gateway && value.gateway.notifications ? value.gateway.notifications : 'standard';

      var URLSearchParams = require('url-search-params');
      var urlParams = new URLSearchParams(window.location.search);
      console.log('...', urlParams.has('tap_id'));

      if(!urlParams.has('token')){
        this.RootStore.apiStore.generateToken(this.config).then(obj => {
          this.token = obj.token;
          console.log('token', this.token);
        });
      }


  }
}

function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}

decorate(ConfigStore, {
  config: observable,
  token: observable,
  notifications:observable,
  gateway: observable,
  redirect_url: observable,
  language: observable
  // legalConfig:observable
});

export default ConfigStore;
