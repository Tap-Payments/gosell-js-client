import React, { Component }  from 'react';
import {decorate, observable, computed} from 'mobx';
import {NotificationBar} from '../lib/modal/';

class UIStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.openModal = false;
    this.isLoading = true;

    this.btnLoader = false;
    this.msgLoader = false;
    //main payment page --> currencies --> merchant info in SwipeableViews (mobile view)
    this.activePage = 0;
    this.pay_btn = false;

    //screen width --> switch between mobile / pc views
    this.width = window.innerWidth;
    this.isMobile = window.innerWidth <= 500 ? true : false;

    if(this.isMobile){
       this.subPage = 0
       this.pageIndex = 0;
       this.confirm = 0;
    }else {
      this.subPage = -1;
      //main payment page -> otp ...  in SwipeableViews
      this.pageIndex = -1;
      this.confirm = -1;
    }

    //the selected and active card in saved cards list
    this.isActive = null;

    this.dir = 'ltr';

    //shake the payment cards when the user press edit
    this.shake_cards = false;
    this.delete_card = false;
    //
    // //display error or Otp when click on the payment button
    // this.slide_up = false;

    this.notifications = 'standard';

    // this.setPageIndex(0);

    this.load = true;
    this.edit_customer_cards = 'Edit';
    this.modal_mode = 'popup';

    this.errorHandler = {};
    this.msg = {};

    this.closeNotification = this.closeNotification.bind(this);

  }

  formatNumber(num) {
    if(num){
      if(typeof num == 'string'){
        return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
      else {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
    }
    else {
      return num;
    }
  }

  computed
  get getDir(){
    return this.dir;
  }

  computed
  get getOpenModal(){
    return this.openModal;
  }

  setOpenModal(value){
    this.openModal = value;
  }

  computed
  get getLoadingStatus(){
    return this.isLoading;
  }

  startLoading(loader_type, title, msg){
    console.log('loader_type', loader_type + ' ' + true);

    this.RootStore.uIStore.setMsg({
      type: loader_type,
      title: title,
      desc: msg,
      close: false
    });
     this.isLoading = true;
     this.load = true;
  }

  showResult(loader_type, title, msg){
    this.RootStore.uIStore.setMsg({
      type: loader_type,
      title: title,
      desc: msg,
      handleClose: true
    });
     this.isLoading = true;
     this.load = false;
  }

  stopLoading(){
    this.isLoading = false;
  }

  computed
  get getBtnLoaderStatus(){
    return this.btnLoader;
  }

  startBtnLoader(){
    this.btnLoader = true;
  }

  stopBtnLoader(){
    this.btnLoader = false;
  }

  computed
  get getMsgLoaderStatus(){
    return this.msgLoader;
  }

  startMsgLoader(){
    this.msgLoader = true;
  }

  stopMsgLoader(){
    this.msgLoader = false;
  }

  computed
  get getIsMobile(){
    return this.isMobile;
  }

  setIsMobile(value){
    this.isMobile = value;
  }

  setActivePage(value){
    this.activePage = value;
  }

  computed
  get getActivePage(){
    return this.activePage;
  }

  setSubPage(value){
    this.subPage = value;
  }

  computed
  get getSubPage(){
     return this.subPage;
  }

  computed
  get getPageIndex(){
    return this.pageIndex;
  }

  setPageIndex(value){
    this.pageIndex = value;
  }

  computed
  get getIsActive(){
    return this.isActive;
  }

  setIsActive(value){
    if(value === 'FORM' || value === 'WEB'){
      this.delete_card = false;
      this.edit_customer_cards = 'Edit';
      this.shakeCards(false);
    }
    else {
      this.detete_card = false;
    }

    this.isActive = value;
  }

  shakeCards(value){
    var skake = this.shake_cards;
    this.payBtn(false);

    if(!value){
      this.shake_cards = false;
      this.edit_customer_cards = 'Edit';
    }
    else {
      this.shake_cards = true;
      this.edit_customer_cards = 'Cancel';
    }

    this.RootStore.paymentStore.selected_card = null;

  }

  // deleteCard(value, id){
  //   if(this.RootStore.paymentStore.selected_card === id){
  //     this.delete_card = value;
  //
  //     if(value){
  //       this.shakeCards(false);
  //     }
  //     else {
  //       this.shakeCards(true);
  //     }
  //
  //     console.log('delete card', this.delete_card);
  //     console.log('shake card', this.shake_cards);
  //     console.log('pay_btn card', this.pay_btn);
  //   }
  //
  //
  // }

  payBtn(value){
    this.pay_btn = value;
    console.log('pay btn ........... > ', this.pay_btn);
  }

  closeNotification(){
    this.errorHandler = {};
  }

  computed
  get generateCustomNotification(){

   console.log('notifications >>>>>>>>>>>>', this.RootStore.configStore.notifications);

    if(this.RootStore.configStore.notifications !== 'standard' && !this.getErrorHandler.options){
        console.log('id', this.RootStore.configStore.notifications);

        var el = document.getElementById(this.RootStore.configStore.notifications);
        console.log('element', el);

        if(this.getErrorHandler.msg && el != null){
          el.innerHTML = this.getErrorHandler.msg;

        }

        return(
          <NotificationBar
            mode={null}
            dir={this.getDir}
            show={false}>
          </NotificationBar>);
      }
      else if(this.RootStore.configStore.notifications === 'standard' || this.getErrorHandler.options){
        return(
          <NotificationBar
            mode={this.getErrorHandler.type}
            dir={this.getDir}
            close={this.closeNotification}
            show={this.getErrorHandler.visable}
            options={this.getErrorHandler.options}>
              {this.getErrorHandler.msg}
          </NotificationBar>
        );
      }
  }

  computed
  get getErrorHandler(){
    return this.errorHandler;
  }

  setErrorHandler(value){
    this.errorHandler = value;
  }

  computed
  get getMsg(){
    return this.msg;
  }

  setMsg(value){
    this.msg = value;
  }

  // handleClicks(e){
  //   console.log('target', e.target.id);
  //
  //   switch (ref.id) {
  //     case "currencies":
  //       if(this.getActivePage === 1 && this.getSubPage === 0){
  //         this.setActivePage(0);
  //         this.getIsMobile ? this.setSubPage(0) : this.setSubPage(-1);
  //        }
  //        else { // open currencies list
  //         this.setActivePage(1);
  //         this.setSubPage(0);
  //       }
  //       break;
  //     case "cards":
  //         this.setActivePage(0);
  //         this.getIsMobile ? this.setSubPage(0) : this.setSubPage(-1);
  //         this.setIsActive('CARD');
  //         this.RootStore.paymentStore.selectCard(this.cardRef);
  //       break;
  //     case "myFrame":
  //         this.setActivePage(0);
  //         this.getIsMobile ? this.setSubPage(0) : this.setSubPage(-1);
  //         this.setIsActive('FORM');
  //         break;
  //     default:
  //       this.setIsActive(null);
  //       this.RootStore.paymentStore.selectCard(null);
  //       this.setActivePage(0);
  //       this.getIsMobile ? this.setSubPage(0) : this.setSubPage(-1);
  //       break;
  //   }
  //
  // }

}

decorate(UIStore, {
  openModal: observable,
  isLoading: observable,
  load:observable,
  activePage: observable,
  pageIndex: observable,
  subPage: observable,
  isActive: observable,
  expandCurrencies: observable,
  expandBusinessInfo: observable,
  dir: observable,
  isMobile: observable,
  width: observable,
  btnLoader: observable,
  shake_cards: observable,
  delete_card:observable,
  slide_up: observable,
  msgLoader: observable,
  notifications:observable,
  confirm:observable,
  pay_btn: observable,
  edit_customer_cards: observable,
  errorHandler: observable,
  msg: observable,
  modal_mode:observable
});

export default UIStore;
