import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
// import myjson from 'https://goselljslib.b-cdn.net/local.json';
import Paths from '../../webpack/paths';

class LocalizationStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    // this.strings = require('./local.json');

    this.strings = null;
    this.isLoading = true;
    this.getLocalization()
  }

  async getLocalization(){
    var self = this;
    axios.post(Paths.serverPath +'/localization', {})
    .then( function (response) {
      // console.log('localization', response);
      self.strings =  response.data;
      self.isLoading = false;
    })
    .catch(function (error) {
      console.log("error", error);
    });
  }

  getContent(key, lang) {
    if(this.strings!==null){
      const _defaultLang  = this.RootStore.configStore.language ? this.RootStore.configStore.language.toLowerCase() : 'en'
      const _lang = lang ? lang.toLowerCase() : _defaultLang;
      if(key){
        const txt = this.strings[key][_lang];
        if (txt) {
          // console.log('txt',txt);
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

decorate(LocalizationStore, {
  isLoading: observable
});

export default LocalizationStore;
