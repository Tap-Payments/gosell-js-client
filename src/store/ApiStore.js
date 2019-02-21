import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
import Paths from '../../webpack/paths';
import "@babel/polyfill";

class ApiStore{

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.getMerchantDetailsFlag = false;
    this.setPaymentOptionsFlag  = false;
  }
  updateLoader(){
    if (this.getMerchantDetailsFlag && this.setPaymentOptionsFlag){
      this.RootStore.uIStore.stopLoading();
      this.getMerchantDetailsFlag = false;
      this.setPaymentOptionsFlag  = false;
    }
  }

  async auth(publicKey){
     var self = this;

     var body = {
       "mode": "Production",
       "headers": {
         "authorization": "Bearer " + publicKey,
       }
     }

     var res = null, data = null;
     await axios.post(Paths.serverPath + '/init', body)
     .then(async function (response) {

       res = response.data;

       // console.log('auth response', res);

       if(res.status === 'success'){

         data = res.data;

         self.mode = data.live_mode;
         self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
         self.RootStore.uIStore.modal_bg_img = data.merchant.background.url;

         self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
         self.RootStore.merchantStore.session = await data.session_token;

         self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
         self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
         self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;

         self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
         self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);

       }
       else if(response.data.error || response.data.errors){
           self.sendResponse(response.data);
       }

     })
     .catch(function (error) {
       self.sendResponse(error);
       // console.log(error);

     });

     return await res;

  }

  async init(){
    console.log(
      "%cinit()",
      "background: yellow; color: black; display: block;"
    );
     var self = this;

     this.RootStore.uIStore.dir = this.RootStore.configStore.language === 'ar' ? 'rtl' : 'ltr';

     // console.log('session ', self.RootStore.merchantStore.session);

     if(self.RootStore.merchantStore.session == null){

       // console.log('public key', this.RootStore.configStore.gateway.publicKey);
       await this.auth(this.RootStore.configStore.gateway.publicKey).then(async result => {
         console.log('auth response from init ', result);
         if(result.error || result.errors){
           self.sendResponse(result);
         }  else {
           self.getMerchantDetails();
           self.setPaymentOptions();
         }

       });
     }  else {
       self.getMerchantDetails();
       self.setPaymentOptions();
     }
   }

 sendResponse(json) {
    var self = this;

    if(json.errors){
      console.log(json.errors);
      self.RootStore.configStore.callbackFunc(json);

      if(json.errors[0].code == 99999){
        self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('session_error_msg', null), null);
      }
      else {
        self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null), null);
      }
    }
    else if(json.error){
      console.log(json.error);
      self.RootStore.configStore.callbackFunc(json);

      if(json.error.code == 99999){
        self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('session_error_msg', null), null);
      }
      else {
        self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null), null);
      }
    }
    else if(json.response){
      console.log(json.response);
      self.RootStore.configStore.callbackFunc(json);
      self.RootStore.uIStore.showMsg('warning', self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null), null);
      // self.RootStore.uIStore.showMsg('error', json.response.message, json.id);
    }
    // else if(json.message){
    //   console.log(json.message);
    //   self.RootStore.configStore.callbackFunc(json.message);
    //   // self.RootStore.uIStore.showMsg('warning', json.message, json.code);
    // }
    // else {
    //   self.RootStore.uIStore.showMsg('warning', 'Something went wrong!', null);
    // }
  }

  async setPaymentOptions(){
    var self = this;
    self.setPaymentOptionsFlag  = false;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var mode = null;
    switch (this.RootStore.configStore.transaction_mode){
      case 'charge':
        mode = "PURCHASE";
        break;
      case 'authorize':
          mode = "AUTHORIZE_CAPTURE";
          break;
      default:
        mode = null;
        break;
    }

    var customer = this.RootStore.configStore.gateway.customerCards && this.RootStore.configStore.customer ? this.RootStore.configStore.customer.id : null;

    var body = {
      "mode": "Production",
      "method": 'POST',
      "path": '/v2/payment/types',
      "headers": headers,
      "reqBody": {
         "transaction_mode": mode,
         "items": this.RootStore.configStore.items,
         "shipping": this.RootStore.configStore.shipping,
         "taxes": this.RootStore.configStore.taxes,
         "customer": customer,
         "currency" :  this.RootStore.configStore.order.currency,
         "total_amount": this.RootStore.configStore.order.amount
      }
    }

    var res = null, data = null;
    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {

       res = response;
       console.log('**** options API', res);

         if(response.status == 200){
           self.setPaymentOptionsFlag  = true;

           if(response.data.error || response.data.errors){
             self.sendResponse(response.data);
           }
           else {
             await self.RootStore.paymentStore.getPaymentMethods(response.data, self.RootStore.configStore.order ? self.RootStore.configStore.order.currency : null);
           }

         }
         else {
            // self.RootStore.uIStore.showMsg('warning', response.data.errors[0].description, response.data.errors[0].code);
            self.sendResponse(response.data);
         }

    })
    .catch(function (error) {
      console.log("error", error);
    });
    self.updateLoader()
    return await res;
  }

  async getMerchantDetails(){
    var self = this;
    self.getMerchantDetailsFlag = false

    var headers = {
      'session_token': self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": 'GET',
      "path": '/v2/merchant',
      "headers": headers
    }

    var res = null;

    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {

      res = response;
      console.log('**** merchant API', res);

        if(res.status == 200){
          self.getMerchantDetailsFlag = true

          if(res.data.error || res.data.errors){
            self.sendResponse(res.data);
          }
          else {
            await self.RootStore.merchantStore.setDetails(res.data);
          }

        }
        else {
            // self.RootStore.uIStore.showMsg('warning', response.data.errors[0].description, response.data.errors[0].code);
            await self.sendResponse(res.data);
        }


    })
    .catch(function (error) {
      console.log(error);
    });
    self.updateLoader()
    return await res;
  }

  async createTransaction(publicKey){
     var self = this;

     var transaction = null;

     await this.auth(self.RootStore.configStore.gateway.publicKey).then(async result => {
       // console.log('auth response', result);
       if(result.status === 'success'){

         switch (self.RootStore.configStore.transaction_mode) {
           case 'charge':
             transaction = await self.charge('src_all', null, null);
             break;
           case 'authorize':
             transaction = await self.authorize('src_all', null, null);
             break;
         }

       }
       else {
         if(result.error || result.errors){
           self.sendResponse(result);
         }
       }

     });

     return await transaction;

   }

  async handleTransaction(source, type, fees){
    var transaction = null;
    var self = this;

    switch (this.RootStore.configStore.transaction_mode) {
      case 'charge':
        transaction = this.charge(source, type, fees).then(async chg => {
          console.log('charge', chg.data);
            if(chg.status == 200){

                if(chg.data.status && chg.data.status.toUpperCase() === 'INITIATED'){
                  // console.log('chg.data.transaction', chg.data.transaction);
                  // console.log('chg.data.authenticate', chg.data.authenticate);

                  if(chg.data.transaction && chg.data.transaction.url){
                      window.open(chg.data.transaction.url, '_self');
                  } else if(chg.data.authenticate){
                      self.RootStore.paymentStore.charge = chg.data;
                      self.RootStore.paymentStore.authenticate = chg.data.authenticate;

                      if(chg.data.authenticate.status === 'INITIATED'){
                        self.RootStore.uIStore.setPageIndex(2, 'y');
                        self.RootStore.uIStore.stopBtnLoader();
                      }
                  }
                }
                else if(chg.data.status && chg.data.status.toUpperCase() === 'CAPTURED'){
                  self.sendResponse(chg.data);
                  self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('gosell_successful_transaction', null), chg.data.id);
                }
                else if(chg.data.status && (chg.data.status.toUpperCase() === 'ABANDONED' || chg.data.status.toUpperCase() === 'CANCELLED' || chg.data.status.toUpperCase() === 'FAILED' || chg.data.status.toUpperCase() === 'DECLINED' || chg.data.status.toUpperCase() === 'RESTRICTED' || chg.data.status.toUpperCase() === 'VOID' || chg.data.status.toUpperCase() === 'TIMEDOUT')) {
                  self.sendResponse(chg.data);
                  self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), chg.data.id);
                }
                else {
                  self.sendResponse(chg.data);
                }

            }
            else {
              self.sendResponse(chg.data);
            }
        });
        break;
      case 'authorize':
        transaction = this.authorize(source, type, fees).then(async auth => {
          if(auth.status == 200){

              if(auth.data.status && auth.data.status.toUpperCase() === 'INITIATED'){
                console.log('auth.data.transaction', auth.data.transaction);
                console.log('auth.data.authenticate', auth.data.authenticate);

                if(auth.data.transaction && auth.data.transaction.url){
                    window.open(auth.data.transaction.url, '_self');
                } else if(auth.data.authenticate){
                    self.RootStore.paymentStore.charge = auth.data;
                    self.RootStore.paymentStore.authenticate = auth.data.authenticate;

                    if(auth.data.authenticate.status === 'INITIATED'){
                      self.RootStore.uIStore.setPageIndex(2, 'y');
                      self.RootStore.uIStore.stopBtnLoader();
                    }
                }
              }
              else if(auth.data.status && (auth.data.status.toUpperCase() === 'VOID' || auth.data.status.toUpperCase() === 'AUTHORIZED' || auth.data.status.toUpperCase() === 'CAPTURED')){
                self.sendResponse(auth.data);
                self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('gosell_successful_transaction', null), auth.data.id);
              }
              else if(auth.data.status && (auth.data.status.toUpperCase() === 'ABANDONED' || auth.data.status.toUpperCase() === 'CANCELLED' || auth.data.status.toUpperCase() === 'FAILED' || auth.data.status.toUpperCase() === 'DECLINED' || auth.data.status.toUpperCase() === 'RESTRICTED' || auth.data.status.toUpperCase() === 'TIMEDOUT')) {
                self.sendResponse(auth.data);
                self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), auth.data.id);
              }
              else {
                self.sendResponse(auth.data);
              }
          }
          else {
            self.sendResponse(auth.data);
          }

        });
        break;
    }

    return await transaction;
  }

  async charge(source, type, fees){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/charges",
      "headers": headers,
      "reqBody": {
        "id": this.RootStore.configStore.charge.id ? this.RootStore.configStore.charge.id : null,
        "amount": this.RootStore.configStore.order.amount,
        "currency": this.RootStore.configStore.order.currency,
        "product":"GOSELL",
        "threeDSecure":this.RootStore.paymentStore.three_d_Secure,
        "save_card":this.RootStore.paymentStore.save_card_option,
        "fee": fees,
        "statement_descriptor":this.RootStore.configStore.charge.statement_descriptor,
        "description":this.RootStore.configStore.charge.description,
        "metadata":this.RootStore.configStore.charge.metadata,
        "reference":this.RootStore.configStore.charge.reference,
        "receipt":this.RootStore.configStore.charge.receipt,
        "customer": this.RootStore.configStore.customer,
        "source":{
          "id": source
        },
        "post":{
          "url": this.RootStore.configStore.charge.post
        },
        "redirect":{
          "url": this.RootStore.configStore.charge.redirect
        },
        "selected_currency":this.RootStore.paymentStore.current_currency.currency,
        "selected_amount":this.RootStore.paymentStore.current_currency.amount
      }
    }

    var res = null;

    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {
      res = response;
      console.log('charge', response);

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;

  }

  async authorize(source, type, fees){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    console.log('save_card_option: ', this.RootStore.paymentStore.save_card_option);
    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/authorize",
      "headers": headers,
      "reqBody": {
        "id": this.RootStore.configStore.authorize.id ? this.RootStore.configStore.authorize.id : null,
        "amount": this.RootStore.configStore.order.amount,
        "currency": this.RootStore.configStore.order.currency,
        "product":"GOSELL",
        "threeDSecure":this.RootStore.paymentStore.three_d_Secure,
        "save_card":this.RootStore.paymentStore.save_card_option,
        "fee": fees,
        "statement_descriptor":this.RootStore.configStore.authorize.statement_descriptor,
        "description":this.RootStore.configStore.authorize.description,
        "metadata":this.RootStore.configStore.authorize.metadata,
        "reference":this.RootStore.configStore.authorize.reference,
        "receipt":this.RootStore.configStore.authorize.receipt,
        "customer": this.RootStore.configStore.customer,
        "source":{
          "id": source
        },
        "auto": {
          "type": this.RootStore.configStore.authorize.auto.type,
          "time": this.RootStore.configStore.authorize.auto.time,
        },
        "post":{
          "url": this.RootStore.configStore.authorize.post
        },
        "redirect":{
          "url": this.RootStore.configStore.authorize.redirect
        },
        "selected_currency":this.RootStore.paymentStore.current_currency.currency,
        "selected_amount":this.RootStore.paymentStore.current_currency.amount
      }
    }

    var result, res = null;

    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {
      res = response;
      console.log('authorize', res);

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

  async getTransaction(id){
     var self = this;

     var transaction = null;

     if(self.RootStore.merchantStore.session == null){
       await this.auth(this.RootStore.configStore.gateway.publicKey).then(async result => {
         console.log('auth response from getTransaction', result);
         if(result.status !== 'success'){
           self.sendResponse(result);
         }
       });
     }

     var type = id.substring(0,4);

     switch (type) {
       case 'chg_':
         transaction = await self.getCharge(id);
         break;
       case 'auth':
         transaction = await self.getAuthorize(id);
         break;
     }

     return await transaction;

   }

    async getTransactionResult(id){
        var self = this;

        var transaction = null;

        if(self.RootStore.merchantStore.session == null){
          await this.auth(this.RootStore.configStore.gateway.publicKey).then(async result => {
            console.log('auth response from getTransactionResult', result);
            if(result.status !== 'success'){
              self.sendResponse(result);
              // self.RootStore.uIStore.showMsg('warning', result.errors[0].description, result.errors[0].code);
            }

          });
        }

        var type = id.substring(0,4);

        switch (type) {
          case 'chg_':
            await self.getCharge(id).then(async charge => {

                if(charge.status == 200){
                    transaction = charge;
                    if(charge.data.status && charge.data.status.toUpperCase() === 'INITIATED'){
                        window.open(chg.data.transaction.url, '_self');
                    }
                    else if(charge.data.status && charge.data.status.toUpperCase() === 'CAPTURED'){
                      console.log('CAPTURED', charge.data);

                      self.RootStore.configStore.callbackFunc(charge.data);
                      self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('gosell_successful_transaction', null), charge.data.id);
                    }
                    else if(charge.data.status && (charge.data.status.toUpperCase() === 'ABANDONED' || charge.data.status.toUpperCase() === 'CANCELLED' || charge.data.status.toUpperCase() === 'FAILED' || charge.data.status.toUpperCase() === 'DECLINED' || charge.data.status.toUpperCase() === 'RESTRICTED' || charge.data.status.toUpperCase() === 'VOID' || charge.data.status.toUpperCase() === 'TIMEDOUT')) {
                      self.sendResponse(charge.data);
                      self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), charge.data.id);
                    }
                    else {
                      self.sendResponse(charge.data);
                    }
              }
              else {
                console.log('error', charge);
                self.sendResponse(charge.data);
              }
            });
            break;
          case 'auth':
            console.log('In auth');
            await self.getAuthorize(id).then(async auth => {

              console.log('auth res', auth);
              if(auth.status == 200){
                  transaction = auth;

                  if(auth.data.status && auth.data.status.toUpperCase() === 'INITIATED'){
                      window.open(auth.data.transaction.url, '_self');
                  }
                  else if(auth.data.status && (auth.data.status.toUpperCase() === 'VOID' || auth.data.status.toUpperCase() === 'CAPTURED' || auth.data.status.toUpperCase() === 'AUTHORIZED')){
                    console.log(auth.data);
                    self.RootStore.configStore.callbackFunc(charge.data);
                    self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('gosell_successful_transaction', null), auth.data.id);
                  }
                  else if(auth.data.status && (auth.data.status.toUpperCase() === 'ABANDONED' || auth.data.status.toUpperCase() === 'CANCELLED' || auth.data.status.toUpperCase() === 'FAILED' || auth.data.status.toUpperCase() === 'DECLINED' || auth.data.status.toUpperCase() === 'RESTRICTED' || auth.data.status.toUpperCase() === 'TIMEDOUT')) {
                    self.sendResponse(auth.data);
                    self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), auth.data.id);
                  }
                  else {
                    self.sendResponse(auth.data);
                  }

              }
              else {
                console.log('error', auth.data);
                self.sendResponse(auth.data);
              }
            });
            break;
        }

        console.log('I am here', transaction);
        return await transaction;

      }

  async getCharge(chg_id){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/charges/"+chg_id,
      "headers": headers
    }

    var res = null;
    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {
      res = response;

    })
    .catch(function (error) {
      console.log('error', error);
      return error;
    });

    return await res;
  }

  async getAuthorize(auth_id){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/authorize/" + auth_id,
      "headers": headers
    }

    var res = null;
    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {
      res = response;

    })
    .catch(function (error) {
      console.log('error', error);
      return error;
    });

    return await res;
  }

  async deleteCard(card_id, index){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "DELETE",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id +"/"+ card_id,
      "headers": headers
    }

    var res = null;
    await axios.post(Paths.serverPath + '/api', body)
    .then(async function (response) {
      res = response.data;

      if(response.status == 200 && (res.error || res.errors)){
          self.sendResponse(response.data);
      }
      else {
        self.RootStore.uIStore.setErrorHandler({
          visable: true,
          code: res.status,
          msg: self.RootStore.localizationStore.getContent('card_deleting_error', null),
          type: 'error'
        });
      }

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

  async updateCards(){
    var self = this;
    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": 'POST',
      "path": '/v2/payment/types',
      "headers": headers,
      "reqBody": {
         "customer": this.RootStore.configStore.customer.id ? this.RootStore.configStore.customer.id : null,
         "currency" : this.RootStore.paymentStore.current_currency.currency,
         "total_amount": this.RootStore.paymentStore.current_currency.amount
      }
    }

    var res = null; var result = null;

    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {

       res = response.data;

         if(response.status == 200){
           console.log(res);

           if(response.data.error || response.data.errors){
             self.RootStore.uIStore.setErrorHandler({
               visable: true,
               code: 'error',
               msg: self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null),
               type: 'error'
             });
           }
           else {
             setTimeout(function(){
               self.RootStore.uIStore.setErrorHandler({
                 visable: true,
                 code: 'success',
                 msg: self.RootStore.localizationStore.getContent('card_deleted_successfully', null),
                 type: 'success'
               });
             }, 200);
           }

         }
         else {
           console.log("result", res);

           self.RootStore.uIStore.setErrorHandler({
             visable: true,
             code: 'error',
             msg: self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null),
             type: 'error'
           });

         }


    })
    .catch(function (error) {
      console.log("error", error);
    });

    return await res;
  }

  // async updateCardsList(){
  //   var self = this;
  //
  //   var headers = {
  //     'session_token':self.RootStore.merchantStore.session
  //   }
  //
  //   var body = {
  //     "mode": "Production",
  //     "method": "GET",
  //     "path": "/v2/card/"+ this.RootStore.configStore.customer.id,
  //     "headers": headers
  //   }
  //
  //   var res = null;
  //
  //   await axios.post(Paths.serverPath + '/api', body)
  //   .then(async function (response) {
  //     res = response.data;
  //
  //     console.log('get cards response', res);
  //
  //       if(response.status == 200){
  //         console.log('cards list', res.data);
  //         if(res.error || res.errors){
  //           self.sendResponse(response.data);
  //         }
  //         else {
  //           self.RootStore.paymentStore.setCards(res.data);
  //         }
  //
  //       }
  //       else {
  //         console.log('error', res);
  //         self.sendResponse(response.data);
  //       }
  //
  //
  //   })
  //   .catch(function (error) {
  //     console.log('error', error);
  //     // self.RootStore.uIStore.setErrorHandler({
  //     //   visable: true,
  //     //   code: error.status ? error.status : null,
  //     //   msg: error.message ? error.message : null,
  //     //   type: 'error'
  //     // });
  //   });
  //   return await res;
  // }

  async getSavedCardToken(card){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    console.log('customer', this.RootStore.configStore.customer.id);

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/tokens",
      "headers": headers,
      "reqBody": {
        "saved_card": {
          "card_id": card,
          "customer_id": this.RootStore.configStore.customer.id
        }
      }
    }

    var result, res = null;
    await axios.post(Paths.serverPath + '/api', body)
    .then(async function (response) {
      res = response;
      console.log('token', res);

        if(res.status != 200 || (res.data.error || res.data.errors) || res.status == 'fail'){
          self.sendResponse(res.data);
        }
        // else{
        //   var error = res.data;
        //   console.log('error', error);
        //
        //   self.RootStore.uIStore.setErrorHandler({
        //     visable: true,
        //     code: error.status,
        //     msg: self.RootStore.localizationStore.getContent('gosell_something_went_wrong', null),
        //     type: 'error'
        //   });
        //
        // }

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }


  async createCustomer(){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/customers",
      "headers": headers,
      "reqBody": {
        "first_name": this.RootStore.configStore.customer.first_name,
        "middle_name": this.RootStore.configStore.customer.middle_name,
        "last_name": this.RootStore.configStore.customer.last_name,
        "email": this.RootStore.configStore.customer.email,
        "phone": {
          "country_code": this.RootStore.configStore.customer.phone.country_code,
          "number": this.RootStore.configStore.customer.phone.number
        },
        // "description": this.RootStore.configStore.description,
        // "metadata": this.RootStore.configStore.metadata,
        // "currency": this.RootStore.paymentStore.current_currency.currency
      }
    }

    var res = null;
    await axios.post(Paths.serverPath + '/api', body)
    .then(async function (response) {
      res = response;

      console.log('get customer response', res);

        if(res.status == 200){
          console.log('customer', res.data);

          if(res.data.error || res.data.errors){
              self.sendResponse(res.data);
          }
          else {
            self.RootStore.configStore.customer = res.data;
          }

        }
        else {
          console.log('error', res);
          self.sendResponse(res.data);
        }

    })
    .catch(function (error) {
      console.log('error', error);
    });
    return await res;
  }

  async saveCustomerCard(token){
    var self = this;

    // self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
    //var customer = null;
    if(this.RootStore.configStore.customer && this.RootStore.configStore.customer.id){
      var customer = this.RootStore.configStore.customer;
      this.createCard(customer.id, token);
    }
    else {
      this.createCustomer().then(result => {
        if(result.status == 200){
          if(result.error || result.errors){
              self.sendResponse(res.data);
          }
          else {
            self.createCard(self.RootStore.configStore.customer.id, token);
          }
        }
      });
    }
  }

  async createCard(customer_id, token){
    var self = this;

    self.RootStore.uIStore.startLoading('loader', self.RootStore.localizationStore.getContent('please_wait_msg', null), null);

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/card/" + customer_id,
      "headers": headers,
      "reqBody": {
        "source": token
      }
    }

    var res = null;

    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {

      res = response.data;

      self.RootStore.configStore.callbackFunc(response.data);

      console.log('charge', res);

        if(response.status == 200){
          console.log('card', res);

          if(res.error || res.errors){
              self.sendResponse(res.data);
          }
          else {

            self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('card_has_been_saved', null), res.id);
          }

        }
        else {
          console.log('error', res);
          self.sendResponse(response.data);
        }


    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

  async authentication(type, value){
    var self = this;

    var path = null;
    switch (this.RootStore.configStore.transaction_mode) {
      case 'charge':
        path = "/v2/charges/authenticate/"+this.RootStore.paymentStore.charge.id
        break;
      case 'authorize':
        path = "/v2/authorize/authenticate/"+this.RootStore.paymentStore.authorize.id
        break;
    }

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": path,
      "headers": headers,
      "reqBody": {
        "type": type,
        "value":value
      }
    }

    var res = null;
    await axios.post(Paths.serverPath + '/api', body)
    .then(async function (response) {
      res = response.data;

        if(response.status == 200){

          console.log('otp response', response);
          console.log('otp auth', res);
          if(res.status === 'INITIATED' && res.transaction.url){
            window.open(res.transaction.url, '_self');
          }
          else if(res.status === 'CAPTURED' || (self.RootStore.configStore.transaction_mode == 'authorize' && (res.status === 'VOID' || res.status === 'AUTHORIZED'))){
            self.RootStore.configStore.callbackFunc(response.data);
            self.RootStore.uIStore.showMsg('success', self.RootStore.localizationStore.getContent('gosell_successful_transaction', null), res.id);
          }
          else {
            self.sendResponse(response.data);
            self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), res.id);
          }
        }
        else {
          console.log('error', res);
          self.sendResponse(response.data);
          self.RootStore.uIStore.showMsg('error', self.RootStore.localizationStore.getContent('gosell_failed_transaction', null), res.id);
        }

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

  async requestAuthentication(type, value){
    var self = this;

    var path = null;
    switch (this.RootStore.configStore.transaction_mode) {
      case 'charge':
        path = "/v2/charges/authenticate/"+ this.RootStore.paymentStore.charge.id
        break;
      case 'authorize':
        path = "/v2/authorize/authenticate/"+this.RootStore.paymentStore.authorize.id
        break;
    }

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "PUT",
      "path": path,
      "headers": headers
    }

    var res = null;
    await axios.post(Paths.serverPath +'/api', body)
    .then(async function (response) {

      res = response.data;
      console.log('request authentication', res);

        if(response.status == 200){
          console.log('res', res);

            if(res.status === 'DECLINED' || (res.error || res.errors)){
              self.RootStore.uIStore.setErrorHandler({});
              self.sendResponse(response.data);
            }else {
              self.RootStore.uIStore.setErrorHandler({
                visable: true,
                code: res.response.code,
                msg: self.RootStore.localizationStore.getContent('otp_code_sent', null),
                type: 'success'
              });
            }
        }
        else {
          self.RootStore.uIStore.setErrorHandler({});
          self.sendResponse(response.data);
        }

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

}

decorate(ApiStore, {});

export default ApiStore;
