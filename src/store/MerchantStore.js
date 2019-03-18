import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class MerchantStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.merchant = null;
    this.pk = null;
    this.session = null;

    this.logo = null;
    this.name = null;
    this.description = null;
    this.contact = null;

    this.isLoading = true;
  }

  computed
  get getLoadingStatus(){
    return this.isLoading;
  }

  setLoadingStatus(value){
      this.isLoading = value;
  }

  setDetails(info){

      if(info != null){

        info = info.merchant;

        console.log('info', info);
        this.logo = info.logo ? info.logo : null;
        this.name = info.name ? info.name : null;
        this.description = info.description ? info.description : null;
        this.contact = info.contact ? info.contact : null;

        this.isLoading = false;

      }

  }

}

decorate(MerchantStore, {
  merchant: observable,
  sk: observable,
  pk: observable,
  session: observable,
  logo: observable,
  name: observable,
  description: observable,
  contact: observable,
  isLoading: observable
});

export default MerchantStore;
