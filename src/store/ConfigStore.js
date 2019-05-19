import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
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
  }

  callbackFunc(data){
    // //console.log('hey ', data);
    if(this.RootStore.configStore.gateway.callback){
      this.RootStore.configStore.gateway.callback(data);
    }
  }

  setConfig(value){
    this.config = value;
    this.gateway = value.gateway ? value.gateway : {};

    this.style = {
        base: value.gateway.style.base && isEmpty(value.gateway.style.base) ? value.gateway.style.base : {
        color: '#535353',
        lineHeight: '18px',
        fontFamily: value.gateway.language === 'en' ? 'Roboto-Light' : 'Helvetica-Light',
        fontUrl: value.gateway.language === 'en' ? Paths.cssPath + 'fontsEn.css' : Paths.cssPath + 'fontsAr.css',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
            color: 'rgba(0, 0, 0, 0.26)',
            fontSize: value.gateway.language === 'en' ? '15px' : '10px'
          }
        },
        invalid: value.gateway.style.invalid && isEmpty(value.gateway.style.invalid) ? value.gateway.style.invalid : {
            color: 'red',
            iconColor: '#fa755a '
        }
      };

    this.notifications = value.gateway && value.gateway.notifications ? value.gateway.notifications : 'standard';

    this.RootStore.apiStore.generateToken(value).then(obj => {
      this.token = obj.token;
      //console.log('token', this.token);
    });

  }

}

function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}

decorate(ConfigStore, {
  config: observable,
  token: observable,
  notifications:observable,
  gateway: observable
});

export default ConfigStore;
