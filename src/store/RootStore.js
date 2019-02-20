import ApiStore from './ApiStore.js';
import PaymentStore from './PaymentStore.js';
import MerchantStore from './MerchantStore.js';
import UIStore from './UIStore.js';
import ConfigStore from './ConfigStore.js';
import ActionStore from './ActionStore.js';
import LocalizationStore from './LocalizationStore.js';
import FormStore from './FormStore.js';

class RootStore {
  constructor() {
    console.log('rootStore');
    this.configStore = new ConfigStore(this);
    this.localizationStore = new LocalizationStore(this);
    this.apiStore = new ApiStore(this);
    this.paymentStore = new PaymentStore(this);
    this.merchantStore = new MerchantStore(this);
    this.actionStore = new ActionStore(this);
    this.formStore = new FormStore(this);
    this.uIStore = new UIStore(this);

    // console.log("this.props.store.uIStore.deviceBrowser()");
    // console.log(this.uIStore.deviceBrowser);
    // console.log(navigator);
    // alert(navigator.appVersion+this.uIStore.deviceBrowser)
  }
}

let Store = new RootStore();
export default Store;