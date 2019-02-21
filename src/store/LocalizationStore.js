import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
// import myjson from 'https://goselljslib.b-cdn.net/local.json';
import Paths from '../../webpack/paths';

class LocalizationStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    // this.strings = require('./local.json');

    this.strings = null;
  }

  async getLocalization(){

   var res = null; var self = this;
   await axios.post(Paths.serverPath +'/localization', {})
   .then(async function (response) {
     console.log('localization', response);
     res = await response;
     self.strings = await res.data;

   })
   .catch(function (error) {
     console.log("error", error);
   });

   return await res;

  }

  getContent(key, lang) {
    if(this.strings!==null){
      const _defaultLang  = this.RootStore.configStore.language ? this.RootStore.configStore.language.toLowerCase() : 'en'
      const _lang = lang ? lang.toLowerCase() : _defaultLang;
      if(key){
        const txt = this.strings[key][_lang];
        if (txt) {
          console.log('txt',txt);
          return txt;
        } else {
          return ' ';
        }
      } else {
        return ' ';
      }
    }
    else{
      return ' ';
    }
  }

}

// decorate(LocalizationStore, {
//
// });

export default LocalizationStore;
