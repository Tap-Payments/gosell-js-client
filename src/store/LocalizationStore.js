import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
class LocalizationStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.strings = require('./local.json');

    console.log(this.getContent('supported_currencies_ebp'));
  }
  getContent(key, lang) {
    const _defaultLang  = this.RootStore.configStore.language ? this.RootStore.configStore.language.toLowerCase() : 'en'
    const _lang = lang ? lang.toLowerCase() : _defaultLang;
    if(key){
      const txt = this.strings[key][_lang];
      if (txt) {
        return txt;
      } else {
        return ' ';
      }
    } else {
      return ' ';
    }

  }
}

// decorate(LocalizationStore, {
//
// });

export default LocalizationStore;
