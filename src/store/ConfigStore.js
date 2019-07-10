import {decorate, observable, computed} from 'mobx';
import Paths from '../../webpack/paths';

class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.reset();
  }

  reset(){
    this.config = null;
    this.gateway = {};
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

    this.gateway = value.gateway ? value.gateway : {};
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

      if(value.gateway.style && isEmpty(value.gateway.style)){
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
              fontSize:this.language === 'en' ? '15px' : '10px'
            }
          },
          invalid: (value.gateway.style && value.gateway.style.invalid) ? value.gateway.style.invalid : {
            color: 'red',
            iconColor: '#fa755a '
          }
        };
      }

      this.notifications = value.gateway && value.gateway.notifications ? value.gateway.notifications : 'standard';

      var URLSearchParams = require('url-search-params');
      var urlParams = new URLSearchParams(window.location.search);
      console.log('...', urlParams.has('tap_id'));

      if(!urlParams.has('tap_id')){
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
  // legalConfig:observable
});

export default ConfigStore;
