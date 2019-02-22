import {decorate, observable, computed} from 'mobx';
import axios from 'axios';


class ActionStore {

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.handleOrderDetailsClick = this.handleOrderDetailsClick.bind(this);
    this.currenciesHandleClick = this.currenciesHandleClick.bind(this);
    this.handleBusinessInfoClick = this.handleBusinessInfoClick.bind(this);
    this.handleCustomerCardsClick = this.handleCustomerCardsClick.bind(this);

    this.onWebPaymentClick = this.onWebPaymentClick.bind(this);
    this.onPayBtnClick = this.onPayBtnClick.bind(this);

    this.handleExtraFeesClick = this.handleExtraFeesClick.bind(this);
    this.handleOTPClick = this.handleOTPClick.bind(this);
    this.sliderAnimationDuration = 1000;
    this.slideEnded = true;
  }

  waitTillSlideEndes(){
    this.slideEnded = false;
    setTimeout(
        function() {
          this.slideEnded = true;
        }
        .bind(this),
        this.sliderAnimationDuration-(this.sliderAnimationDuration/3)
    );
  }

  resetSettings(){

    this.RootStore.uIStore.setIsActive(null);
    this.RootStore.paymentStore.selected_card = null;
    this.RootStore.paymentStore.active_payment_option = null;
    this.RootStore.paymentStore.active_payment_option_fees = 0;
    this.RootStore.paymentStore.active_payment_option = null;
    this.RootStore.paymentStore.active_payment_option_total_amount = 0;
    this.RootStore.paymentStore.active_payment_option_fees = 0;

    this.RootStore.uIStore.shakeCards(false);
    this.RootStore.formStore.clearCardForm();
    // this.RootStore.uIStore.goSellBtn({
    //   title: this.RootStore.configStore.btn,
    //   active: false,
    //   loader: false
    // });

  }

  handleOrderDetailsClick(){
      if((this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader) || this.RootStore.uIStore.getPageIndex != 0){
        this.RootStore.uIStore.warningHandler();
      }
      else if(this.RootStore.uIStore.delete_card === null){
        if(this.slideEnded){
          this.waitTillSlideEndes();
          if(this.RootStore.uIStore.getSubPage === 1 || this.RootStore.uIStore.getSubPage === 0){
            this.RootStore.uIStore.setSubPage(-1);
          }

            this.RootStore.uIStore.goSellBtn({
              title: this.RootStore.configStore.btn,
              active: false,
              loader: false
            });

            this.resetSettings();
            console.log('index', this.RootStore.uIStore.getPageIndex);
              var paymentOptions = document.getElementById('gosell-gateway-payment-options');
              var order = document.getElementById('gosell-gateway-order-details');

              console.log('payment options now', paymentOptions);
              if(this.RootStore.uIStore.show_order_details){
                console.log('setSubPage', this.RootStore.uIStore.getSubPage);


                paymentOptions.style.height = order.style.height;
                order.style.height = 0;
                console.log('payment options now is ', paymentOptions.style.height);
                console.log('order now is ', order.style.height);
                this.RootStore.uIStore.show_order_details = false;
              }
              else{
                order.style.height = paymentOptions.style.height;
                paymentOptions.style.height = 0;
                console.log('order now is ', order.style.height);
                console.log('paymentOptions now is ', paymentOptions.style.height);
                this.RootStore.uIStore.show_order_details = true;
              }

        }
      }
  }

  handleBusinessInfoClick(){

    // console.log('business info', document.getElementById('gosell-business-info'));

    if(this.RootStore.configStore.contactInfo && this.RootStore.merchantStore.contact && this.RootStore.merchantStore.contact.length > 0){

      if((this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader) || (this.RootStore.uIStore.getPageIndex != 0 && this.RootStore.uIStore.getPageIndex != 3 && this.RootStore.uIStore.getPageIndex != 4)){
        this.RootStore.uIStore.warningHandler();
      }
      else if(this.RootStore.uIStore.delete_card === null){

        if(document.getElementById('gosell-business-info') != null){
          var sideMenu = document.getElementById('gosell-side-menu').clientHeight;
          var businessInfo = document.getElementById('gosell-business-info').scrollHeight;

          sideMenu < businessInfo ? document.getElementById('gosell-business-info').style.height = 'fit-content' : document.getElementById('gosell-business-info').style.height = '100%';
        }

        this.resetSettings();

        if(this.RootStore.uIStore.show_order_details){
          this.handleOrderDetailsClick();
        }


          if(this.RootStore.uIStore.getPageIndex === 4 || this.RootStore.uIStore.getSubPage === 1){
            this.RootStore.uIStore.setPageIndex(0, 'x');
            this.RootStore.uIStore.setSubPage(-1);
          }
          else { // open currencies list
            if(this.RootStore.uIStore.getIsMobile){
              this.RootStore.uIStore.setPageIndex(4, 'x');
            }
            else {
              this.RootStore.uIStore.setSubPage(1);
            }
          }

        console.log('pageIndex', this.RootStore.uIStore.getPageIndex );

      }

    }

  }

  currenciesHandleClick(e){

    if(this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader){
      this.RootStore.uIStore.warningHandler();
    }
    else if(this.RootStore.uIStore.delete_card === null){

      // this.RootStore.uIStore.goSellBtn({
      //   title: this.RootStore.configStore.btn,
      //   active: false,
      //   loader: false
      // });
      //
      // this.RootStore.paymentStore.active_payment_option_total_amount = 0;

      this.resetSettings();

      this.RootStore.uIStore.show_order_details = false;

      if(this.RootStore.uIStore.getPageIndex === 3 || this.RootStore.uIStore.getSubPage === 0){
        this.RootStore.uIStore.setPageIndex(0, 'x');
        this.RootStore.uIStore.setSubPage(-1);
      }
      else {
        this.RootStore.uIStore.setIsActive(null);
        // this.RootStore.paymentStore.selected_card = null;
        // this.RootStore.uIStore.payBtn(false);

        if(this.RootStore.paymentStore.supported_currencies.length > 1 ){

          if(this.RootStore.uIStore.getIsMobile){
              this.RootStore.uIStore.setPageIndex(3, 'x');
          }else{
            this.RootStore.uIStore.setSubPage(0);
          }

        }

      }

    }
  }

  handleCustomerCardsClick(ref, obj){
    this.RootStore.uIStore.show_order_details = false;

    if(this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader){
      this.RootStore.uIStore.warningHandler();
    }
    else {
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
        // this.RootStore.uIStore.payBtn(true);

        // var total = this.RootStore.paymentStore.active_payment_option_total_amount > 0 ? this.RootStore.paymentStore.current_currency.symbol + this.RootStore.uIStore.formatNumber(this.RootStore.paymentStore.active_payment_option_total_amount.toFixed(this.RootStore.paymentStore.current_currency.decimal_digit)) : '';
        var total = this.RootStore.paymentStore.active_payment_option_total_amount > 0 ? this.RootStore.paymentStore.getCurrentAmount : '';

        this.RootStore.uIStore.goSellBtn({
          title: this.RootStore.configStore.btn + ' ' + total,
          color: '#2ACE00',
          active: true,
          loader: false
        });

        console.log("pay button ****************************** ", this.RootStore.uIStore.btn.active);
      }
      else {
        // this.RootStore.uIStore.setIsActive(null);
        // // this.RootStore.uIStore.confirm = 0;
        // this.RootStore.paymentStore.selected_card = null;
        // this.RootStore.paymentStore.active_payment_option = null;
        // this.RootStore.paymentStore.active_payment_option_fees = 0;
        // this.RootStore.paymentStore.active_payment_option = null;
        // this.RootStore.paymentStore.active_payment_option_total_amount = 0;
        // this.RootStore.paymentStore.active_payment_option_fees = 0;
        // this.RootStore.uIStore.payBtn(false);

        // this.RootStore.uIStore.goSellBtn({
        //   title: this.RootStore.configStore.btn,
        //   active: false,
        //   loader: false
        // });
        this.resetSettings();
      }
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

           var obj = token.data;
           console.log('token ++++++++++++++++++++++', obj);

           self.RootStore.paymentStore.source_id = obj.id;

           if(token.status == 200){

             if(self.RootStore.paymentStore.active_payment_option_fees > 0){
               self.RootStore.uIStore.setPageIndex(1, 'y');
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

    if(this.RootStore.uIStore.btn.active && this.RootStore.uIStore.btn.loader){
      this.RootStore.uIStore.warningHandler();
    }
    else if(this.RootStore.uIStore.delete_card === null){
      this.resetSettings();

      if(this.RootStore.uIStore.getSubPage === 1 || this.RootStore.uIStore.getSubPage === 0){
        this.RootStore.uIStore.setSubPage(-1);
      }

      if(this.RootStore.uIStore.getPageIndex == 0){
        this.RootStore.formStore.clearCardForm();
        this.RootStore.uIStore.setIsActive('WEB');

        if(payment.extra_fees){
          self.RootStore.paymentStore.active_payment_option = payment;

          this.RootStore.paymentStore.getFees(this.RootStore.paymentStore.active_payment_option.name);

          self.RootStore.paymentStore.source_id = payment.source_id;

          this.RootStore.uIStore.setPageIndex(1, 'y');
        }
        else {
          self.RootStore.paymentStore.active_payment_option = payment;
          self.RootStore.paymentStore.active_payment_option_total_amount = payment.amount;
          self.RootStore.paymentStore.active_payment_option_fees = 0;

          this.RootStore.uIStore.startLoading('loader', self.RootStore.localizationStore.getContent('please_wait_msg', null), null);
          this.RootStore.apiStore.handleTransaction(payment.source_id, 'WEB', 0.0).then(result => {
            console.log('hi from charge response', result);
          });
        }
      }

    }


  }

  handleExtraFeesClick(){
    var self = this;
    var store = this.RootStore;

    console.log('Hey +++++++++++++++++++++++++++++++ ', store.uIStore.getIsActive);
    if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
        store.uIStore.startLoading('loader', store.localizationStore.getContent('please_wait_msg', null), null);
    }

    store.apiStore.handleTransaction(store.paymentStore.source_id,
      store.uIStore.getIsActive,
      store.paymentStore.active_payment_option_fees).then(result =>{

          if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
               store.uIStore.stopBtnLoader();
          }
      });
  }

  handleOTPClick(){
    var self = this;
    var store = this.RootStore;

    store.uIStore.goSellBtn({
      active: true,
      loader: true
    });

    store.uIStore.goSellOtp({
      updated: false
    });

    store.uIStore.startLoading('loader', store.localizationStore.getContent('please_wait_msg', null), null);

    console.log('otp _____ ', store.uIStore.otp);
    console.log('otp value _____ ', store.uIStore.otp.value);

    store.apiStore.authentication(store.paymentStore.authenticate.type, store.uIStore.otp.value).then(result => {
          store.uIStore.stopBtnLoader();
          store.uIStore.setIsActive(null);
          store.paymentStore.selected_card = null;
    });

  }

}


decorate(ActionStore, {

});

export default ActionStore;
