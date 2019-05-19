import UIStore from './UIStore.js';
import ConfigStore from './ConfigStore.js';
import ApiStore from './ApiStore.js';
import FormStore from './FormStore';
import LocalizationStore from './LocalizationStore';

class RootStore {
  constructor() {

    if (! window._babelPolyfill) {
      require("@babel/polyfill");
      //console.log('after @babel-polyfill');
    }

    this.localizationStore = new LocalizationStore(this);
    this.configStore = new ConfigStore(this);
    this.apiStore = new ApiStore(this);
    this.uIStore = new UIStore(this);
    this.formStore = new FormStore(this);
  }
}

let Store = new RootStore();
export default Store;
