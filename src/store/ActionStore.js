import {decorate, observable, computed} from 'mobx';
import axios from 'axios';


class ActionStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.currenciesHandleClick = this.currenciesHandleClick.bind(this);
    this.handleBusinessInfoClick = this.handleBusinessInfoClick.bind(this);
    this.handleCustomerCardsClick = this.handleCustomerCardsClick.bind(this);

    this.onWebPaymentClick = this.onWebPaymentClick.bind(this);
    this.onPayBtnClick = this.onPayBtnClick.bind(this);

    this.handleExtraFeesClick = this.handleExtraFeesClick.bind(this);
  }

  handleBusinessInfoClick(){

    console.log('contact info', this.RootStore.configStore.gateway.contactInfo);

    if(this.RootStore.configStore.contactInfo && this.RootStore.merchantStore.contact && Object.keys(this.RootStore.merchantStore.contact).length > 0){
      this.RootStore.paymentStore.active_payment_option_total_amount = 0;
      this.RootStore.uIStore.setIsActive(null);
      this.RootStore.paymentStore.selected_card = null;
      this.RootStore.uIStore.payBtn(false);

      // if(this.RootStore.uIStore.getIsMobile){
      //   console.log("it's mobile");
      //   this.RootStore.uIStore.setSubPage(1);
      // }
      // else {
      //   console.log("it's not mobile");
      //   this.RootStore.uIStore.setSubPage(-1);
      // }

      if(this.RootStore.uIStore.getIsMobile){
        console.log("it's mobile");
        if(this.RootStore.uIStore.getPageIndex === 4){
          this.RootStore.uIStore.setPageIndex(0, 'x');
        }
        else { // open currencies list
          this.RootStore.uIStore.setIsActive(null);
          this.RootStore.paymentStore.selected_card = null;
          this.RootStore.uIStore.payBtn(false);

          // if(this.RootStore.configStore.contactInfo && this.RootStore.merchantStore.contact && Object.keys(this.RootStore.merchantStore.contact).length > 0){
            this.RootStore.uIStore.setPageIndex(4, 'x');
          // }
        }

      }
      else {
        console.log("it's not mobile");
        if(this.RootStore.uIStore.getSubPage === 1){
          this.RootStore.uIStore.setSubPage(-1);
        }
        else { // open currencies list
          this.RootStore.uIStore.setIsActive(null);
          this.RootStore.paymentStore.selected_card = null;
          this.RootStore.uIStore.payBtn(false);

          // if(this.RootStore.configStore.contactInfo && this.RootStore.merchantStore.contact && Object.keys(this.RootStore.merchantStore.contact).length > 0){
            this.RootStore.uIStore.setSubPage(1);
          // }
        }
      }
    }

    // if(this.RootStore.uIStore.getActivePage === 1 && this.RootStore.uIStore.getSubPage === 1){
    //   this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(1) : this.RootStore.uIStore.setSubPage(-1);
    //   this.RootStore.uIStore.setActivePage(0);
    // }
    // else if(this.RootStore.uIStore.getActivePage === 1 && this.RootStore.uIStore.getSubPage === 0){
    //   this.RootStore.uIStore.setActivePage(0);
    //   this.RootStore.uIStore.setSubPage(1);
    //   this.RootStore.uIStore.setActivePage(1);
    // }
    // else{
    //   this.RootStore.uIStore.setSubPage(1);
    //   this.RootStore.uIStore.setActivePage(1);
    //
    // }
  }

  currenciesHandleClick(e){

    this.RootStore.paymentStore.active_payment_option_total_amount = 0;

    if(this.RootStore.uIStore.getIsMobile){
      console.log("it's mobile");
      if(this.RootStore.uIStore.getPageIndex === 3){
        this.RootStore.uIStore.setPageIndex(0, 'x');
      }
      else { // open currencies list
        this.RootStore.uIStore.setIsActive(null);
        this.RootStore.paymentStore.selected_card = null;
        this.RootStore.uIStore.payBtn(false);

        if(this.RootStore.paymentStore.supported_currencies.length > 1 ){
          this.RootStore.uIStore.setPageIndex(3, 'x');
        }
      }

    }
    else {
      console.log("it's not mobile");
      if(this.RootStore.uIStore.getSubPage === 0){
        this.RootStore.uIStore.setSubPage(-1);
      }
      else { // open currencies list
        this.RootStore.uIStore.setIsActive(null);
        this.RootStore.paymentStore.selected_card = null;
        this.RootStore.uIStore.payBtn(false);

        if(this.RootStore.paymentStore.supported_currencies.length > 1 ){
          this.RootStore.uIStore.setSubPage(0);
        }
      }
    }

    // if(this.RootStore.uIStore.getPageIndex === 3 && this.RootStore.uIStore.getSubPage === 0){
    //   this.RootStore.uIStore.setPageIndex(0, 'x');
    //   this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);
    // }
    // else { // open currencies list
    //   this.RootStore.uIStore.setIsActive(null);
    //   this.RootStore.paymentStore.selected_card = null;
    //   this.RootStore.uIStore.payBtn(false);
    //
    //   if(this.RootStore.paymentStore.supported_currencies.length > 1 ){
    //     this.RootStore.uIStore.setPageIndex(3, 'x');
    //     this.RootStore.uIStore.setSubPage(0);
    //   }
    // }


    // if(this.RootStore.uIStore.getActivePage === 1 && this.RootStore.uIStore.getSubPage === 0){
    //   this.RootStore.uIStore.setActivePage(0);
    //   this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);
    // }
    // else { // open currencies list
    //   this.RootStore.uIStore.setIsActive(null);
    //   this.RootStore.paymentStore.selected_card = null;
    //   this.RootStore.uIStore.payBtn(false);
    //
    //   if(this.RootStore.paymentStore.supported_currencies.length > 1 ){
    //     this.RootStore.uIStore.setActivePage(1);
    //     this.RootStore.uIStore.setSubPage(0);
    //   }
    // }

  }

  handleCustomerCardsClick(ref, obj){
    if(this.RootStore.paymentStore.selected_card !== ref.id && !this.RootStore.uIStore.shake_cards && this.RootStore.uIStore.delete_card == null){

      this.RootStore.uIStore.setSubPage(-1);
      // this.RootStore.uIStore.setActivePage(0);
      // this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);

      this.RootStore.uIStore.setIsActive('CARD');
      this.RootStore.paymentStore.selected_card = ref.id;

      this.RootStore.formStore.clearCardForm();

      this.RootStore.paymentStore.active_payment_option = obj;

      this.RootStore.paymentStore.getFees(this.RootStore.paymentStore.active_payment_option.scheme);
      console.log("Hey I'm here");
      this.RootStore.uIStore.payBtn(true);
      console.log("pay button ****************************** ", this.RootStore.uIStore.pay_btn);
    }
    else {
      this.RootStore.uIStore.setIsActive(null);
      // this.RootStore.uIStore.confirm = 0;
      this.RootStore.paymentStore.selected_card = null;
      this.RootStore.paymentStore.active_payment_option = null;
      this.RootStore.paymentStore.active_payment_option_fees = 0;
      this.RootStore.paymentStore.active_payment_option = null;
      this.RootStore.paymentStore.active_payment_option_total_amount = 0;
      this.RootStore.paymentStore.active_payment_option_fees = 0;
      this.RootStore.uIStore.payBtn(false);
    }
  }

  // cardFormHandleClick(){
  //   // if(ref.id === 'tap-cards-form'){
  //     this.RootStore.paymentStore.selected_card = null;
  //
  //     //clear open menus
  //     this.RootStore.uIStore.setActivePage(0);
  //     this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);
  //
  //     if(this.RootStore.uIStore.getIsActive !== 'FORM'){
  //       this.RootStore.paymentStore.active_payment_option_total_amount = 0;
  //       //form is active
  //       this.RootStore.uIStore.setIsActive('FORM');
  //       this.RootStore.uIStore.payBtn(false);
  //     }
  //
  //     this.RootStore.uIStore.setIsActive('FORM');
  //   // }
  // }

  onPayBtnClick(){

    var self = this;

   this.RootStore.uIStore.startBtnLoader();

    if(this.RootStore.uIStore.getIsActive === 'CARD'){

      var card_id = this.RootStore.paymentStore.selected_card;
      console.log('card', this.RootStore.paymentStore.selected_card);

      this.RootStore.apiStore.getSavedCardToken(card_id).then(token => {
        console.log('card token', token);

        var obj = token.data;
        console.log('token ++++++++++++++++++++++', obj);

        self.RootStore.paymentStore.source_id = obj.id;

        if(token.status == 200){

          if(self.RootStore.paymentStore.active_payment_option_fees > 0){
            self.RootStore.uIStore.setPageIndex(1, 'y');
            // self.RootStore.uIStore.confirm = 0;
            self.RootStore.uIStore.stopBtnLoader();
          }
          else {
            this.RootStore.apiStore.handleTransaction(self.RootStore.paymentStore.source_id , 'CARD', 0.0).then(charge => {
                console.log('charge result', charge);
                self.RootStore.uIStore.stopBtnLoader();
            });
          }
        }
      });
    }
  }

  onWebPaymentClick(payment){
    var self = this;

    this.RootStore.formStore.clearCardForm();
    this.RootStore.uIStore.setIsActive('WEB');

    if(payment.extra_fees){
      self.RootStore.paymentStore.active_payment_option = payment;

      this.RootStore.paymentStore.getFees(this.RootStore.paymentStore.active_payment_option.name);

      self.RootStore.paymentStore.source_id = payment.source_id;
      this.RootStore.uIStore.setPageIndex(1, 'y');
      // this.RootStore.uIStore.confirm = 0;
    }
    else {
      self.RootStore.paymentStore.active_payment_option = payment;
      self.RootStore.paymentStore.active_payment_option_total_amount = payment.amount;
      self.RootStore.paymentStore.active_payment_option_fees = 0;

      this.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
      this.RootStore.apiStore.handleTransaction(payment.source_id, 'WEB', 0.0).then(result => {
        console.log('hi from charge response', result);
      });
    }

  }

  handleExtraFeesClick(){
    var self = this;
    var store = this.RootStore;

    console.log('Hey +++++++++++++++++++++++++++++++ ', store.uIStore.getIsActive);
    if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
        store.uIStore.startLoading('loader', 'Please Wait', null);
    }

    store.apiStore.handleTransaction(store.paymentStore.source_id,
      store.uIStore.getIsActive,
      store.paymentStore.active_payment_option_fees).then(result =>{

          if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
               store.uIStore.stopBtnLoader();
          }
      });
  }
}


decorate(ActionStore, {

});

export default ActionStore;
