import React, { Component }  from 'react';
import {decorate, observable, computed} from 'mobx';
import {NotificationBar} from '../lib/modal/';

class UIStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.openModal = false;
    this.isLoading = true;

    // this.btnLoader = false;
    this.msgLoader = false;

    // this.pay_btn = false;

    //screen width --> switch between mobile / pc views
    this.width = window.innerWidth;
    // this.isMobile = window.innerWidth <= 500 ? true : false;
    this.isMobile = window.innerWidth <= 823 ? true : false;

    this.subPage = -1;
    this.pageDir = 'x';
    this.pageIndex = 0;

    //the selected and active card in saved cards list
    this.isActive = null;

    this.dir = 'ltr';

    //shake the payment cards when the user press edit
    this.shake_cards = false;
    this.delete_card = null;

    this.notifications = 'standard';

    this.load = true;
    this.edit_customer_cards = 'Edit';
    this.modal_mode = 'popup';

    this.mainHeight = 0;
    this.sliderHeight = 0;

    if(this.getIsMobile){
      this.modalHeight = '90%';
      this.bodyHeight = '90%';
    }
    else {
      this.modalHeight = 'fit-content';
      this.bodyHeight = 'fit-content';
    }


    this.modal_bg_img = null;
    // this.modal_bg_img = 'https://ak7.picdn.net/shutterstock/videos/10256567/thumb/1.jpg';
    // this.modal_bg_img = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5fbt_We8MuRrBLMU-rhczNxpAkivP0RKlxrIS8-k2FkeNsALL';

    this.show_order_details = false;

    this.errorHandler = {};
    this.msg = {};

    this.btn = {};
    this.otp = {
      updated: false,
      value: null
    }

    this.modal = {
      mode: 'advanced',
      modalStyle: {
        'modal': {width:'400px',height: 'fit-content'},
        'body': {backgroundColor: '#E9E9E9', height: 'fit-content', minHeight: '227px'}
      },
      headerStyle:{
        'header': {backgroundColor: '#F7F7F7', height: 'auto', marginTop: '50px'},
        'titleStyle': {cursor: 'pointer'},
        'iconStyle': {width: '85px', height: '85px', borderRadius:'100%'}
      }
    }

    this.closeNotification = this.closeNotification.bind(this);

    this.targetElement = React.createRef();

  }

  calcElementsHeight(id){

    if(this.getIsMobile){

      this.setMainHeight(0);

      var modalBodyHeight = document.getElementsByClassName("tap-payments-modal-body")[0].clientHeight - 86;

      const node = document.getElementById(id);
      console.log('node', node);
      const allDivs = Array.from(node.querySelectorAll("#"+id+" > div"));

      var self = this;
      var total = 0;
      allDivs.forEach(function(element) {
        total += element.clientHeight;
      });

      console.log('&& total', total);
      console.log('&& modalBodyHeight', modalBodyHeight);

      if(modalBodyHeight > total || (id === 'form-container' && modalBodyHeight < total)){
        this.setMainHeight(total);
      }
      else {
        this.setMainHeight(modalBodyHeight);
      }
      // if(modalBodyHeight >= total){
      //   this.setMainHeight(total);
      // }
      // else {
      //   this.setMainHeight(modalBodyHeight);
      // }

    }
    else {
      this.setMainHeight(0);

      const node = document.getElementById(id);
      console.log('node', node);
      const allDivs = Array.from(node.querySelectorAll("#"+id+" > div"));

      var self = this;
      var total = 0;
      allDivs.forEach(function(element) {
        total += element.clientHeight;
        console.log('height', element.clientHeight);
      });

      this.setMainHeight(total);


    }

  }

  setMainHeight(value){

    this.mainHeight = value;
    console.log('&& mainHeight', this.mainHeight);

    if(this.mainHeight > 0){

      if(this.getIsMobile){
        this.bodyHeight = this.mainHeight + 86;
        console.log('&& bodyHeight', this.bodyHeight);
        this.modalHeight = this.bodyHeight + 65;
        console.log('&& modalHeight', this.modalHeight);
      }
      else {
        this.bodyHeight = this.mainHeight + 86;
        console.log('&& bodyHeight', this.bodyHeight);
        this.modalHeight = this.bodyHeight + 156;
        console.log('&& modalHeight', this.modalHeight);
      }
    }

    this.calcModalHeight();
    this.setSliderHeight();

  }

  calcModalHeight(){

    if(this.getIsMobile){
      this.modal = {
        mode: 'simple',
        modalStyle: {
          'modal': {height: this.modalHeight},
          'body': {backgroundColor: '#E9E9E9', height: this.bodyHeight, maxHeight: '90%'}
        },
        headerStyle: {
          'header': {backgroundColor: '#F7F7F7', height: '65px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '40px', height: '40px', borderRadius:'100%'}
        }
      }
    }
    else {
      this.modal = {
        mode: 'advanced',
        modalStyle: {
          'modal': {width:'400px',height: this.modalHeight},
          'body': {backgroundColor: '#E9E9E9', height: this.bodyHeight}
        },
        headerStyle:{
          'header': {backgroundColor: '#F7F7F7', height: '106px', marginTop: '50px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '85px', height: '85px', borderRadius:'100%'}
        }
      }
    }

  }

  setSliderHeight(){

    var self = this;

    switch (this.getPageIndex) {
      case 0:
        self.sliderHeight = self.mainHeight;
        break;
      case 1:
        self.sliderHeight = self.mainHeight;
        break;
      case 2:
        self.sliderHeight = self.mainHeight;
        break;
      case 3:
        self.sliderHeight = self.bodyHeight;
        break;
      case 4:
        self.sliderHeight = self.bodyHeight;
        break;
    }

    // this.calcModalHeight();
  }

  formatNumber(num){
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
  get deviceOS() {
    var useragent = navigator.userAgent;
    if(useragent.match(/Android/i)) {
      return 'phone';
    } else if(useragent.match(/webOS/i)) {
      return 'phone';
    } else if(useragent.match(/iPhone/i)) {
      return 'phone';
    } else if(useragent.match(/iPod/i)) {
      return 'ipad';
    } else if(useragent.match(/iPad/i)) {
      return 'ipad';
    } else if(useragent.match(/Windows Phone/i)) {
      return 'phone';
    } else if(useragent.match(/SymbianOS/i)) {
      return 'phone';
    } else if(useragent.match(/RIM/i) || useragent.match(/BB/i)) { //blackberry
      return 'phone';
    } else {
      return 'pc';
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

  showMsg(loader_type, title, msg){
    var self = this;
    self.startLoading('loader', 'Please Wait', null);

    setTimeout(function(){
      self.showResult(loader_type, title, msg);
    }, 1000);
  }

  redirectTo(url){
      window.open(url, '_self');
  }

  stopLoading(){
    if(!this.RootStore.paymentStore.isLoading && !this.RootStore.merchantStore.isLoading){
      this.isLoading = false;
    }
  }

  startBtnLoader(){
    this.btn.loader = true;
  }

  stopBtnLoader(){
    this.btn.loader = false;
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

  // setActivePage(value){
  //   this.activePage = value;
  // }
  //
  // computed
  // get getActivePage(){
  //   return this.activePage;
  // }

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

  setPageIndex(value, dir){
    var self = this;

    if(dir === 'x'){
      if(this.pageIndex > value){
        this.pageDir = '-x';
      }
      else if(this.pageIndex < value){
        this.pageDir = 'x';
      }
    }
    else if(dir === 'y'){
      if(this.pageIndex > value){
        this.pageDir = '-y';
      }
      else if(this.pageIndex < value){
        this.pageDir = 'y';
      }
    }

    switch (value) {
      case 0:
        self.goSellBtn({
          title: self.RootStore.configStore.btn,
          color: '#2ACE00',
          active: false,
          loader: false
        });
        // self.sliderHeight = self.mainHeight;
        break;
      case 1:
        self.goSellBtn({
          title: "Confirm",
          color: '#007AFF',
          active: true,
          loader: false
        });
        // self.sliderHeight = self.mainHeight;
        break;
      case 2:
        self.goSellBtn({
          title: "Confirm",
          color: '#007AFF',
          active: false,
          loader: false
        });
        // self.sliderHeight = self.mainHeight;
        break;
      default:
        self.mainHeight = '100%';
        self.goSellBtn({});
    }

    this.pageIndex = value;
    this.setSliderHeight();
  }

  computed
  get getIsActive(){
    return this.isActive;
  }

  setIsActive(value){
    if(value === 'FORM' || value === 'WEB'){
      this.delete_card = null;
      this.edit_customer_cards = 'Edit';

      if(this.RootStore.configStore.transaction_mode !== 'get_token' && this.RootStore.configStore.transaction_mode !== 'get_token'){
        this.shakeCards(false);
      }
    }
    else {
      this.detete_card = false;
    }

    this.isActive = value;
  }

  shakeCards(value){
    var skake = this.shake_cards;
    this.goSellBtn({
      title: this.RootStore.configStore.btn,
      color: '#2ACE00',
      active: false,
      loader: false
    });

    if(!value){
      this.shake_cards = false;
      this.edit_customer_cards = 'Edit';
    }
    else {
      this.shake_cards = true;
      this.errorHandler = {};
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
  // }

  // payBtn(value){
  //   this.btn.active = value;
  //
  //   if(!this.btn.active){
  //     this.btn.loader = false;
  //     this.RootStore.paymentStore.active_payment_option_total_amount = 0;
  //   }
  // }

  goSellBtn(value){

    if(!value.active){
      this.btn.active = false;
      this.btn.loader = false;
      // this.RootStore.paymentStore.active_payment_option_total_amount = 0;
    }

    this.btn = {
      title: value.title ? value.title : this.btn.title,
      color: value.color ? value.color : this.btn.color,
      active: value.active ? value.active : this.btn.active,
      loader: value.loader ? value.loader : this.btn.loader,
    }

    console.log('btn is active? ', this.btn.active);
  }

  goSellOtp(value){

    this.otp = {
      updated: value.updated ? value.updated : this.otp.updated,
      value:value.value ? value.value : this.otp.value
    }

  }

  closeNotification(){
    var self = this;

    this.errorHandler.visable = false;
    setTimeout(function(){
      self.errorHandler = {};
    }, 500);

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
    console.log(this.delete_card,"342345234sfgsdfbsdfg3w4$@#$%#@$%@#$@$#");
    var self = this;
    this.errorHandler = value;

    if(this.delete_card === null || this.detete_card !== false) {
      setTimeout(function(){
        self.closeNotification();
      }, 5000);
    }
  }

  warningHandler(){
    this.setErrorHandler({
      visable: true,
      code: 'error',
      msg: "Please wait until the payment process is completed!",
      type: 'warning'
    });
  }

  computed
  get getMsg(){
    return this.msg;
  }

  setMsg(value){
    this.msg = value;
  }
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
  // pay_btn: observable,
  edit_customer_cards: observable,
  errorHandler: observable,
  msg: observable,
  modal_mode:observable,
  modal_bg_img:observable,
  pageDir: observable,
  show_order_details: observable,
  mainHeight:observable,
  animationStatus: observable,
  btn: observable,
  otp: observable,
  modal: observable,
  modalHeight: observable,
  bodyHeight: observable,
  sliderHeight: observable
});

export default UIStore;
