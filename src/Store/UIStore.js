import {decorate, observable, computed} from 'mobx';

class UIStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.openModal = false;
    this.isLoading = true;

    this.btnLoader = false;
    this.msgLoader = false;
    //main payment page --> currencies --> merchant info in SwipeableViews (mobile view)
    this.activePage = 0;

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

    //display error or Otp when click on the payment button
    this.slide_up = false;

    this.notifications = 'standard';

    // this.setPageIndex(0);

    this.load = true;

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

    this.RootStore.apiStore.setMsg({
      type: loader_type,
      title: title,
      desc: msg
    });
     this.isLoading = true;
     this.load = true;
  }

  showResult(loader_type, title, msg){
    this.RootStore.apiStore.setMsg({
      type: loader_type,
      title: title,
      desc: msg
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
      this.isActive = value;
  }

  computed
  get getShakeStatus(){
    return this.shake_cards;
  }

  shakeCards(){
    var skake = this.getShakeStatus;
    this.shake_cards = !skake;
  }

  computed
  get getSlideUp(){
    return this.slide_up;
  }

  slideUp(value){
    this.slide_up = value;
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
  slide_up: observable,
  msgLoader: observable,
  notifications:observable,
  confirm:observable
});

export default UIStore;
