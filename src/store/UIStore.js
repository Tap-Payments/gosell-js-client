import React, { Component }  from 'react';
import {decorate, observable, computed} from 'mobx';
// import {NotificationBar, Modal} from '@tap-payments/modal-fix';
import {Modal, NotificationBar} from '../lib/modal';

class UIStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.openModal = false;
    this.isLoading = true;

    // this.btnLoader = false;
    this.msgLoader = false;

    this.modalID = "gosell-lightbox-payment-gateway";
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
    this.edit_customer_cards = null;
    this.modalMode = 'popup';

    this.mainHeight = 0;
    this.sliderHeight = 0;

    if(this.isMobile){
      this.modalHeight = '90%';
      this.bodyHeight = '90%';
    }
    else {
      this.modalHeight = 'fit-content';
      this.bodyHeight = 'fit-content';
    }

    this.modal_bg_img = null;
    // this.modal_bg_img = 'https://ak7.picdn.net/shutterstock/videos/10256567/thumb/1.jpg';
    // this.modal_bg_img = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';

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
        'titleStyle': {cursor: 'pointer', margin: 'auto'},
        'iconStyle': {width: '85px', height: '85px', borderRadius:'100%'}
      }
    }

    this.closeNotification = this.closeNotification.bind(this);

    this.targetElement = React.createRef();
    this.browser = null;
    this.deviceBrowser;

    this.keyboard = false;
  }

  calcElementsHeight(id){

    const node = document.getElementById(id);

    if(node){
      if(this.isMobile){
        if(!this.keyboard){
          // console.log('keyboard is not active');

          this.setMainHeight(0);

          // var modalBodyHeight = document.getElementsByClassName("tap-payments-modal-body")[0].clientHeight - 86;

          var modalBodyHeight = this.bodyHeight - 86;

          const allDivs = Array.from(node.querySelectorAll("#"+id+" > div"));

          var self = this;
          var total = 10;
          allDivs.forEach(function(element) {
            total += element.clientHeight;
          });

          if(modalBodyHeight > total || (id === 'gosell-gateway-form-container' && modalBodyHeight < total)){
            this.setMainHeight(total);
            this.bodyHeight = total + 86;
            this.modalHeight = this.bodyHeight + 65;
          }
          else {
            this.setMainHeight(modalBodyHeight);
          }

        }
        // else {
        //   console.log('keyboard is active');
        // }

      }
      else {
        this.setMainHeight(0);

        const node = document.getElementById(id);
        //console.log('node', node);
        const allDivs = Array.from(node.querySelectorAll("#"+id+" > div"));

        var self = this;
        var total = 10;
        allDivs.forEach(function(element) {
          total += element.clientHeight;
          //console.log('height', element.clientHeight);
        });

        this.setMainHeight(total);


      }

      this.calcModalHeight();
      this.setSliderHeight();
    }

  }

  setMainHeight(value){

    this.mainHeight = value + 2;

      if(this.isMobile){
        var w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

        this.modalHeight = height - 50;

        this.bodyHeight = this.modalHeight - 65;

        // console.log('// mainHeight', this.mainHeight);
        // console.log('// bodyHeight', this.bodyHeight);
        // console.log('// modalHeight', this.modalHeight);
      }
      else {
        // console.log('// mainHeight', this.mainHeight);

        this.bodyHeight = this.mainHeight + 86;
        // console.log('// bodyHeight', this.bodyHeight);
        this.modalHeight = this.bodyHeight + 156;
        // console.log('// modalHeight', this.modalHeight);
      }

  }

  calcModalHeight(){

    if(this.isMobile){
      this.modal = {
        mode: 'simple',
        modalStyle: {
          'modal': {height: this.modalHeight},
          'body': {backgroundColor: '#E9E9E9', height: this.bodyHeight, maxHeight: '90%'}
        },
        headerStyle: {
          'header': {backgroundColor: '#F7F7F7', height: '65px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '50px', height: '50px', borderRadius:'100%', margin: '12px'}
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
          'titleStyle': {cursor: 'pointer', margin: 'auto 0'},
          'iconStyle': {width: '85px', height: '85px', borderRadius:'100%'}
        }
      }
    }

  }

  setSliderHeight(){

    var self = this;
    // this.RootStore.formStore.blurCardForm();
    console.log('setSliderHeight index', this.getPageIndex);
    console.log('setSliderHeight height', this.sliderHeight);
    // setTimeout(function(){
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
    // }, 1000);


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
  get deviceBrowser() {
    var browser = null;
    var isChromium = window.chrome;
    var uA = navigator.userAgent,
    isIE = /msie\s|trident\/|edge\//i.test(uA) && !!(document.uniqueID || document.documentMode || window.ActiveXObject || window.MSInputMethodContext),
    checkVersion = (isIE && +(/(edge\/|rv:|msie\s)([\d.]+)/i.exec(uA)[2])) || NaN;
    var isOpera = navigator.userAgent.indexOf("OPR") > -1 || navigator.userAgent.indexOf("Opera") > -1;
    if(!this.isMobile) {
      if(!!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g)) {
        browser = "IE";
      }
      else if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        browser = "FireFox";
      }
      else if(isChromium !== null && isOpera == true) {
        browser = "Opera";
      }
      else if(navigator.appVersion.indexOf('Edge') > -1) {
        browser = "Edge"
      }
      else if(navigator.userAgent.indexOf("Chrome") != -1) {
        browser = "Chrome";
      }
      else if(navigator.userAgent.toLowerCase().indexOf('safari/') > -1) {
        browser = "Safari";
      }
      this.browser = browser;
      return browser;
    }
    else {
      var isIE = /*@cc_on!@*/false || !!document.documentMode;

      if(typeof InstallTrigger !== 'undefined' || navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || navigator.userAgent.toLowerCase().indexOf('fxios') > -1) {
        browser = "FireFox";
      }
      else if(navigator.userAgent.toLowerCase().indexOf('edga/') >= 0 || navigator.userAgent.toLowerCase().indexOf('edgios/') >= 0) {
        browser = "Edge";
      }
      else if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 || navigator.userAgent.toLowerCase().indexOf('safari/') <= 0) {
        browser = "Opera";
      }
      else if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime) || navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.toLowerCase().indexOf('crios/') >= 0){
        browser = "Chrome";
      }
      else if(navigator.userAgent.toLowerCase().indexOf('safari/') > -1) {
        browser = "Safari";
      }
      this.browser = browser;
      return browser;
      // Blink engine detection
      // var isBlink = (isChrome || isOpera) && !!window.CSS;
    }
  }


  // computed
  // get dir(){
  //   return this.dir;
  // }

  // computed
  // get getOpenModal(){
  //   return this.openModal;
  // }

  setOpenModal(value){
    this.openModal = value;
  }

  // computed
  // get getLoadingStatus(){
  //   return this.isLoading;
  // }

  startLoading(loader_type, title, msg){
    //console.log('loader_type', loader_type + ' ' + true);

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
    self.startLoading('loader', this.RootStore.localizationStore.getContent('please_wait_msg', null), null);

    setTimeout(function(){
      self.showResult(loader_type, title, msg);
    }, 1000);
  }

  redirectTo(url){
      window.open(url, '_self');
  }

  stopLoading(){
    if(!this.RootStore.paymentStore.isLoading && !this.RootStore.merchantStore.isLoading && !this.RootStore.localizationStore.isLoading){
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

  // computed
  // get getIsMobile(){
  //   return this.isMobile;
  // }

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
        this.dir==='ltr'?
          this.pageDir = '-x'
          :
          this.pageDir = 'x'
      }
      else if(this.pageIndex < value){
        this.dir==='ltr'?
          this.pageDir = 'x'
          :
          this.pageDir = '-x'
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
        break;
      case 1:
        self.goSellBtn({
          title: self.RootStore.localizationStore.getContent('btn_confirm_title', null),
          color: '#007AFF',
          active: true,
          loader: false
        });
        break;
      case 2:
        self.goSellBtn({
          title: self.RootStore.localizationStore.getContent('btn_confirm_title', null),
          color: '#007AFF',
          active: false,
          loader: false
        });
        break;
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
      this.edit_customer_cards = this.RootStore.localizationStore.getContent('common_edit', null);

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
      this.edit_customer_cards = this.RootStore.localizationStore.getContent('common_edit', null);

    }
    else {
      this.shake_cards = true;
      // this.errorHandler = {};
      this.edit_customer_cards = this.RootStore.localizationStore.getContent('common_cancel', null);
      if(this.getSubPage === 1 || this.getSubPage === 0){
        this.setSubPage(-1);
      }
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
  //     //console.log('delete card', this.delete_card);
  //     //console.log('shake card', this.shake_cards);
  //     //console.log('pay_btn card', this.pay_btn);
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
      //console.log('!value.active');
      this.btn.active = false;
      // this.RootStore.paymentStore.active_payment_option_total_amount = 0;
    }

    this.btn = {
      title: value.title ? value.title : this.btn.title,
      color: value.color ? value.color : this.btn.color,
      active: value.active ? value.active : this.btn.active,
      loader: value.loader ? value.loader : this.btn.loader,
    }

    // //console.log('btn is active? ', this.btn.active);
  }

  goSellOtp(value){
    this.otp = {
      updated: value.updated ? value.updated : this.otp.updated,
      value:value.value ? value.value : this.otp.value
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
  get generateCustomNotification(){

    var self = this;
    if(this.RootStore.configStore.notifications !== 'standard' && !this.getErrorHandler.options){
        //console.log('id', this.RootStore.configStore.notifications);

        var el = document.getElementById(this.RootStore.configStore.notifications);
        //console.log('element', el);

        if(this.getErrorHandler.msg && el != null){
          //console.log('this is happening');
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

  warningHandler(){
    this.setErrorHandler({
      visable: true,
      code: 'error',
      msg: this.RootStore.localizationStore.getContent('gosell_payment_process_warning_msg', null),
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
  modalMode:observable,
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
  sliderHeight: observable,
  browser: observable,
  modalID: observable,
  keyboard: observable
});

export default UIStore;
