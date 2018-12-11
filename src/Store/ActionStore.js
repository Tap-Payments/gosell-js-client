import {decorate, observable, computed} from 'mobx';
import axios from 'axios';


class ActionStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.currenciesHandleClick = this.currenciesHandleClick.bind(this);
    this.handleCustomerCardsClick = this.handleCustomerCardsClick.bind(this);
    this.cardFormHandleClick = this.cardFormHandleClick.bind(this);

    this.onWebPaymentClick = this.onWebPaymentClick.bind(this);
    this.onPayBtnClick = this.onPayBtnClick.bind(this);
  }

  currenciesHandleClick(e){


    if(this.RootStore.uIStore.getActivePage === 1 && this.RootStore.uIStore.getSubPage === 0){
      this.RootStore.uIStore.setActivePage(0);
      this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);
    }
    else { // open currencies list
      this.RootStore.uIStore.setIsActive(null);
      this.RootStore.paymentStore.selected_card = null;

      if(this.RootStore.paymentStore.supported_currencies.length > 1 ){
        this.RootStore.uIStore.setActivePage(1);
        this.RootStore.uIStore.setSubPage(0);
      }
    }

  }

  handleCustomerCardsClick(ref){
    console.log('clicked!!!!', ref);
    if(this.RootStore.paymentStore.selected_card === ref.id || this.RootStore.uIStore.getShakeStatus){
      this.RootStore.uIStore.setIsActive(null);
      this.RootStore.paymentStore.selected_card = null;
      this.RootStore.uIStore.confirm = 0;
      this.RootStore.paymentStore.active_payment_option = null;
      this.RootStore.paymentStore.active_payment_option_fees = 0;
    }
    else {
      this.RootStore.uIStore.setActivePage(0);
      this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);

      this.RootStore.uIStore.setIsActive('CARD');
      this.RootStore.paymentStore.selected_card = ref.id;

    }

  }

  cardFormHandleClick(ref){

    if(ref.id === 'tap-cards-form'){

      //this.setIsActive(null);
      this.RootStore.paymentStore.selected_card = null;

      //clear open menus
      this.RootStore.uIStore.setActivePage(0);
      this.RootStore.uIStore.getIsMobile ? this.RootStore.uIStore.setSubPage(0) : this.RootStore.uIStore.setSubPage(-1);

      //form is active
      this.RootStore.uIStore.setIsActive('FORM');
    }
    else {
      //form isn't active
      this.RootStore.uIStore.setIsActive(null);
    }
  }

  onPayBtnClick(){

    var self = this;

   this.RootStore.uIStore.startBtnLoader();

    if(this.RootStore.uIStore.getIsActive === 'CARD'){

      var card_id = this.RootStore.paymentStore.selected_card;
      console.log('card', this.RootStore.paymentStore.selected_card);

      this.RootStore.apiStore.getSavedCardToken(card_id).then(token => {
        console.log('card token', token);

        var obj = JSON.parse(token.body);

        self.RootStore.paymentStore.source_id = obj.id;
        self.RootStore.paymentStore.active_payment_option = obj.card;

        if(token.statusCode == 200){

          self.RootStore.paymentStore.getCardFees(self.RootStore.paymentStore.active_payment_option.brand);
          console.log('fees', self.RootStore.paymentStore.active_payment_option_fees);
          if(self.RootStore.paymentStore.active_payment_option_fees > 0){
            self.RootStore.uIStore.setPageIndex(1);
            self.RootStore.uIStore.confirm = 0;
          }
          else {
            this.RootStore.apiStore.charge(self.RootStore.paymentStore.source_id , 'CARD', 0.0).then(charge => {
                console.log('charge result', charge);

            });
          }
        }
      });

    }

  }

  onWebPaymentClick(payment){
    var self = this;

    console.log("Payment from onWebPaymentClick >>>>>>>>>>>>", payment);
    if(payment.extra_fees != null){
      self.RootStore.paymentStore.active_payment_option = payment;
      self.RootStore.paymentStore.source_id = payment.source_id;
      this.RootStore.uIStore.setPageIndex(1);
      this.RootStore.uIStore.confirm = 0;
    }
    else {
      this.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
      this.RootStore.apiStore.charge(payment.source_id, 'WEB', payment.extra_fees ? payment.extra_fees[0].value : 0.0).then(result => {
        console.log('hi from charge response', result);
      });
    }

  }
}


decorate(ActionStore, {

});

export default ActionStore;
