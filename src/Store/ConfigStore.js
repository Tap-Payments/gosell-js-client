import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

//include all the
class ConfigStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.gateway = null;
    this.transaction_mode = null;
    this.customer = null;

    this.charge = null;
    this.authorize = null;
    this.saveCard = null;
    this.token = null;

    this.order = null;

    this.items = null;
    this.shipping = null;
    this.taxes = null;

  }

  config(value){
    if(value.gateway){
      if(value.gateway != null){
        this.gateway = value.gateway;
      }
      else {
        console.log("Something went wrong! Please check the goSell configration");
      }
    }

    if(value.charge){
      this.transaction_mode = 'charge';
      this.charge = value.charge;
      this.RootStore.paymentStore.charge = this.charge;
      
      if(value.order){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }

      this.customer = value.customer;
    }
    else if(value.authorize){
      this.transaction_mode = 'authorize';
      this.authorize = value.authorize;

      if(value.order){
        this.items = value.order.items;
        this.shipping = value.order.shipping;
        this.taxes = value.order.taxes;
        this.order = {currency: value.order.currency, amount: value.order.amount};
      }

      this.customer = value.customer;
    }
    else if(value.saveCard){
      this.transaction_mode = 'save_card';
      this.saveCard = value.saveCard;
      this.customer = value.customer;
    }
    else if(value.token){
      this.transaction_mode = 'get_token';
      this.token = value.token;
    }
    else {
      console.log("Something went wrong! Please check the goSell configration");
    }
  }

}


decorate(ConfigStore, {
  gateway: observable,
  transaction_mode: observable,
  customer: observable,
  charge: observable,
  authorize: observable,
  saveCard: observable,
  token: observable,
  order: observable,
  items: observable,
  shipping: observable,
  taxes: observable,
});

export default ConfigStore;
