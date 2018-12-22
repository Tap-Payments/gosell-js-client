import ApiStore from './ApiStore.js';
import PaymentStore from './PaymentStore.js';
import MerchantStore from './MerchantStore.js';
import UIStore from './UIStore.js';
import ConfigStore from './ConfigStore.js';
import ActionStore from './ActionStore.js';
import FormStore from './FormStore.js';


class RootStore {
  constructor() {
    this.apiStore = new ApiStore(this);
    this.paymentStore = new PaymentStore(this);
    this.merchantStore = new MerchantStore(this);
    this.uIStore = new UIStore(this);
    this.configStore = new ConfigStore(this);
    this.actionStore = new ActionStore(this);
    this.formStore = new FormStore(this);
  }
}

let Store = new RootStore();
export default Store;
