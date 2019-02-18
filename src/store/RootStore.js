import ApiStore from './ApiStore.js';
import PaymentStore from './PaymentStore.js';
import MerchantStore from './MerchantStore.js';
import UIStore from './UIStore.js';
import ConfigStore from './ConfigStore.js';
import ActionStore from './ActionStore.js';
import FormStore from './FormStore.js';
import LocalizationStore from './LocalizationStore.js';


class RootStore {
  constructor() {
    console.log('rootStore');
    this.apiStore = new ApiStore(this);
    this.paymentStore = new PaymentStore(this);
    this.merchantStore = new MerchantStore(this);
    this.uIStore = new UIStore(this);
    this.configStore = new ConfigStore(this);
    this.actionStore = new ActionStore(this);
    this.formStore = new FormStore(this);
    this.localizationStore = new LocalizationStore(this);
    // console.log("this.props.store.uIStore.deviceBrowser()");
    // console.log(this.uIStore.deviceBrowser);
  }
}

let Store = new RootStore();
export default Store;
