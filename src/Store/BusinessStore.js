import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class businessStore {

  constructor() {

    this.business = null;
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

  setBusiness(busInfo){

      if(busInfo != null){

        busInfo = JSON.parse(busInfo).merchant;
        console.log('info', busInfo);
        this.business = busInfo;
        this.logo = busInfo.logo;
        this.name = busInfo.name;
      //  this.description = busInfo.description;
        this.contact = busInfo.contact;

        this.setLoadingStatus(false);
      }

  }

  computed
  get getBusiness(){
      return this.business;
  }

  computed
  get getLogo(){
    return this.logo;
  }

  computed
  get getName(){
    return this.name;
  }

  computed
  get getDesc(){
    return this.description;
  }

  computed
  get getContact(){
    return this.contact;
  }
}

decorate(businessStore, {
  business: observable,
  name: observable,
  description: observable,
  contact: observable,
  isLoading: observable
});

export default new businessStore();
