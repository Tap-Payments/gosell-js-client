import {decorate, observable} from 'mobx';
import Paths from '../../webpack/paths';
import AppConfig from './AppConfig.js';

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

    this.app = {
      app_locale:"en_UA",
      requirer:"web.checkout",
      app_id: "gosell.checkout.web",
      app_client_version: "1.4.2",
      app_server_version: "1.4.2",
      requirer_os: "unknown",
      requirer_os_version: "unknown",
      requirer_browser: "unknown",
      requirer_browser_version: "unknown"
    }
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

      this.setAppHeader();

      this.config['app'] = this.app;

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

  setAppHeader(){

    // var OSName = "unknown";
    // var osVersion ="unknown";

    // if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    // if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    // if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    // if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

    // var nAgt = navigator.userAgent;
    // var browserVer = navigator.appVersion;
    // var browserName  = navigator.appName;
    // var verOffset  = 'unknown';
    // var fullVersion = 'unknown';

    // // In Opera, the true version is after "Opera" or after "Version"
    // if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    //   browserName = "Opera";
    //   fullVersion = nAgt.substring(verOffset+6);
    //   if ((verOffset=nAgt.indexOf("Version"))!=-1) 
    //     fullVersion = nAgt.substring(verOffset+8);
    // }
    // // In MSIE, the true version is after "MSIE" in userAgent
    // else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    //   browserName = "Microsoft Internet Explorer";
    //   fullVersion = nAgt.substring(verOffset+5);
    // }
    // // In Chrome, the true version is after "Chrome" 
    // else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    //   browserName = "Chrome";
    //   fullVersion = nAgt.substring(verOffset+7);
    // }
    // // In Safari, the true version is after "Safari" or after "Version" 
    // else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    //   browserName = "Safari";
    //   fullVersion = nAgt.substring(verOffset+7);
    //   if ((verOffset=nAgt.indexOf("Version"))!=-1) 
    //     fullVersion = nAgt.substring(verOffset+8);
    // }
    // // In Firefox, the true version is after "Firefox" 
    // else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    //   browserName = "Firefox";
    //   fullVersion = nAgt.substring(verOffset+8);
    // }
    // // In most other browsers, "name/version" is at the end of userAgent 
    // else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) 
    // {
    //   browserName = nAgt.substring(nameOffset,verOffset);
    //   fullVersion = nAgt.substring(verOffset+1);
    //   if (browserName.toLowerCase()==browserName.toUpperCase()) {
    //   browserName = navigator.appName;
    //   }
    // }

    var app = AppConfig.ui(this);

    this.app = {
      app_locale:this.language == 'ar' ? 'ar_UA' : 'en_UA',
      requirer:"web.checkout",
      app_id: "gosell.checkout.web",
      app_client_version: "1.4.2",
      app_server_version: "1.4.2",
      requirer_os: app.os,
      requirer_os_version: app.osversion,
      requirer_browser: app.browser,
      requirer_browser_version: app.version
    }

    // console.log('apppppp AppConfig.ui()', app);
    // console.log('apppppp', app.browser);
    // console.log('apppppp', app.version);
    // console.log('apppppp', app.os);
    // console.log('apppppp', app.osversion);
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
