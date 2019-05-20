import React, { Component }  from 'react';
import {decorate, observable, computed} from 'mobx';
import NotificationBar from '../elements/NotificationBar';

class UIStore {

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.reset();
  }

  reset(){

    this.tap_id = null;
    this.openModal = false;
    this.modalID = "gosell-lightbox-payment-gateway";
    this.modalMode = 'popup';
    this.errorHandler = {};

    this.isLoading = true;

  }

  setOpenModal(value){
    this.openModal = value;
  }

  computed
  get generateCustomNotification(){

    var self = this;
    //console.log('notifications type', this.RootStore.configStore.notifications);
    //console.log('msg', this.getErrorHandler);

    if(this.RootStore.configStore.notifications !== 'standard' && !this.getErrorHandler.options){
        ////console.log('id', this.RootStore.configStore.notifications);

        var el = document.getElementById(this.RootStore.configStore.notifications);
        ////console.log('element', el);

        if(this.getErrorHandler.msg && el != null){
          ////console.log('this is happening');
          el.innerHTML = this.getErrorHandler.msg;
        }
        setTimeout(function(){
          self.closeNotification();
        }, 5000);

      }
      else if(this.RootStore.configStore.notifications === 'standard' || this.getErrorHandler.options){
        return(
          <NotificationBar
            mode={this.getErrorHandler.type}
            dir={this.dir}
            close={this.closeNotification}
            show={this.getErrorHandler.visable}
            options={this.getErrorHandler.options}>
              {this.getErrorHandler.msg}
          </NotificationBar>
        );
      }
  }

  closeNotification(){
    var self = this;

    if(self.delete_card === null && self.errorHandler.options == null) {
      this.errorHandler.visable = false;
      setTimeout(function(){
        self.errorHandler = {};
      },
      500);
    }
  }

  computed
  get getErrorHandler(){
    return this.errorHandler;
  }

  setErrorHandler(value){
    var self = this;
    this.errorHandler = value;

    if(value.visable){
      window.scroll(0, 0);
    }

    setTimeout(function(){
        self.closeNotification();
    }, 5000);
  }

}

decorate(UIStore, {
  openModal: observable,
  modalMode:observable,
  modalID: observable,
  tap_id: observable,
  errorHandler:observable,
  isLoading:observable
});

export default UIStore;
