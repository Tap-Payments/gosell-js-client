import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class ApiStore{

  constructor(RootStore) {
    this.RootStore = RootStore;
    this.mode = null;
  }

  async auth(publicKey){
     var self = this;

     var body = {
       "mode": "Development",
       "headers": {
         "authorization": "Bearer " + publicKey,
       }
     }

     var res = null, data = null;
     await axios.post(self.RootStore.configStore.location + '/init', body)
     .then(async function (response) {

       res = response.data;

       // console.log('auth response', res);

       if(res.status === 'success'){

         data = res.data;

         self.mode = data.live_mode;
         self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
         self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
         self.RootStore.merchantStore.session = await data.session_token;

         self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
         self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
         self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;

         self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
         self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);


       }

     })
     .catch(function (error) {
       console.log(error);
     });

     return await res;

  }

  async init(){
     var self = this;

     this.RootStore.uIStore.dir = this.RootStore.configStore.language === 'ar' ? 'rtl' : 'ltr';

     var payment = null, merchant = null;

     console.log('session ', self.RootStore.merchantStore.session);

     if(self.RootStore.merchantStore.session == null){
       await this.auth(this.RootStore.configStore.gateway.publicKey).then(async result => {
         console.log('auth response from init ', result);
         if(result.status !== 'success'){
           self.RootStore.uIStore.showMsg('warning', result.errors[0].description, result.errors[0].code);
         }

       });
     }

      merchant = await self.getMerchantDetails();
      payment = await self.setPaymentOptions();

      if(payment.status == 200 && merchant.status == 200){
        this.RootStore.uIStore.stopLoading();
        return await payment;
      }


   }

 // async init(){
 //    var self = this;
 //
 //    this.RootStore.uIStore.dir = this.RootStore.configStore.language === 'ar' ? 'rtl' : 'ltr';
 //
 //    var body = {
 //      "mode": "Development",
 //      "headers": {
 //        "authorization": "Bearer " + this.RootStore.configStore.gateway.publicKey,
 //      }
 //    }
 //
 //    var res = null, data = null, payment = null, merchant = null;
 //    await axios.post(self.RootStore.configStore.location + '/init', body)
 //    .then(async function (response) {
 //
 //      res = response.data;
 //
 //      console.log('init response', res);
 //
 //      if(res.status === 'success'){
 //
 //        data = res.data;
 //        self.mode = data.live_mode;
 //        self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
 //        self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
 //        self.RootStore.merchantStore.session = data.session_token;
 //
 //        self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
 //        self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
 //        self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;
 //
 //        self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
 //        self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);
 //
 //        merchant = await self.getMerchantDetails();
 //
 //        payment = await self.setPaymentOptions();
 //
 //      }
 //      else {
 //        self.RootStore.uIStore.showMsg('warning', res.errors[0].description, res.errors[0].code);
 //      }
 //    })
 //    .catch(function (error) {
 //      console.log(error);
 //    });
 //
 //      if(res.status === 'success' && payment.status == 200 && merchant.status == 200){
 //         this.RootStore.uIStore.stopLoading();
 //         return await res;
 //       }
 //       else {
 //         return await null;
 //       }
 //
 //  }

  async setPaymentOptions(){
    var self = this;

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
         "customer": this.RootStore.configStore.gateway.customerCards && this.RootStore.configStore.customer ? this.RootStore.configStore.customer.id : null,
         "currency" : this.RootStore.configStore.order.currency,
         "total_amount": this.RootStore.configStore.order.amount
      }
    }

    var res = null, data = null;
    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(function (response) {

       res = response;
       console.log('options API', res);

       if(response.data.code != 100){
         if(response.status == 200){
           self.RootStore.paymentStore.getPaymentMethods(response.data, self.RootStore.configStore.order ? self.RootStore.configStore.order.currency : null);
         }
         else {
            self.RootStore.uIStore.showMsg('warning', response.data.errors[0].description, response.data.errors[0].code);
         }
       }
       else {
         self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
       }

    })
    .catch(function (error) {
      console.log("error", error);
    });

    return await res;
  }

  async getMerchantDetails(){
    var self = this;

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

    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(function (response) {

      res = response;
      console.log('merchant API', res);

      if(response.data.code != 100){
        if(res.status == 200){
          self.RootStore.merchantStore.setDetails(response.data);
        }
        else {
           self.RootStore.uIStore.showMsg('warning', response.data.errors[0].description, response.data.errors[0].code);
        }
      }
      else {
        self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }

    })
    .catch(function (error) {
      console.log(error);
    });

    return await res;
  }

  async createTransaction(){
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

         // if(result.status === 'success' && transaction.status == 200){
         //   return await transaction;
         // }
         // else {
         //   return await null;
         // }

       }
       else {
         //self.RootStore.uIStore.showMsg('warning', result.errors[0].description, result.errors[0].code);
         console.log('error', result.errors[0]);
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
          if(chg.status == 200){
              if(chg.data.status && chg.data.status.toUpperCase() === 'INITIATED' && type !== 'CARD'){
                console.log('INITIATED', chg.data);
                window.open(chg.data.transaction.url, '_self');
              }
              else if(chg.data.status && chg.data.status.toUpperCase() === 'CAPTURED' && type !== 'CARD'){
                console.log('CAPTURED form');
                self.RootStore.uIStore.showMsg('success', 'Successful Transaction', chg.data.id);
              }
              else if(chg.data.status &&  chg.data.status.toUpperCase() === 'INITIATED' && type === 'CARD'){
                console.log('CAPTURED card', chg.data);
                self.RootStore.paymentStore.charge = chg.data;
                console.log('charge id', chg.data.id);
                self.RootStore.paymentStore.authenticate = chg.data.authenticate;

                if(chg.data.authenticate && chg.data.authenticate.status === 'INITIATED'){

                  // self.RootStore.uIStore.getIsMobile ? self.RootStore.uIStore.setSubPage(0) : self.RootStore.uIStore.setSubPage(-1);
                  self.RootStore.uIStore.setPageIndex(2, 'y');
                  // self.RootStore.uIStore.confirm = 1;
                }
              }
              else {
                self.RootStore.uIStore.showMsg('error', chg.data.response.message, chg.data.id);
                console.log('charge id', chg.data.id);
              }
          }
          else {
            self.RootStore.uIStore.showMsg('error', chg.data.errors[0].description, null);
          }
        });
        break;
      case 'authorize':
        transaction = this.authorize(source, type, fees).then(async auth => {

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

    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {
      res = response;
      console.log('charge', response);

      console.log('type ==============> ', type);

      if(response.data.code == 100){
        self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }

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

    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('authorize', res);

      if(response.data.code != 100){
        if(response.status == 200){

            if(res.status.toUpperCase() === 'INITIATED' && type !== 'CARD'){
              console.log('INITIATED', res);
              window.open(res.transaction.url, '_self');
            }
            else if(res.status.toUpperCase() === 'AUTHORIZED' && type !== 'CARD'){
              console.log('AUTHORIZED form');
              self.RootStore.uIStore.showMsg('success', 'Authorized Transaction', res.id);
            }
            else if(res.status.toUpperCase() === 'CAPTURED' && type !== 'CARD'){
              console.log('CAPTURED form');
              self.RootStore.uIStore.showMsg('success', 'Captured Transaction', res.id);
            }
            else if(res.status.toUpperCase() === 'INITIATED' && type === 'CARD'){
              console.log('CAPTURED card', res);
              self.RootStore.paymentStore.authorize = res;
              console.log('charge id', res.id);
              self.RootStore.paymentStore.authenticate = res.authenticate;

              if(res.authenticate && res.authenticate.status === 'INITIATED'){
                self.RootStore.uIStore.getIsMobile ? self.RootStore.uIStore.setSubPage(0) : self.RootStore.uIStore.setSubPage(-1);
                self.RootStore.uIStore.setPageIndex(2, 'y');
                // self.RootStore.uIStore.confirm = 1;
              }
            }
            else {
              self.RootStore.uIStore.showMsg('error', res.response.message, null);
            }
        }
        else {
          console.log('!= 200', res);
          self.RootStore.uIStore.showMsg('error', res.errors[0].description, null);

        }

      }
      else {
        self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }
    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

  async getTransaction(id){
     var self = this;

     var transaction = null;

     // console.log('session ', self.RootStore.merchantStore.session);

     if(self.RootStore.merchantStore.session == null){
       await this.auth(this.RootStore.configStore.gateway.publicKey).then(async result => {
         console.log('auth response from getTransaction', result);
         if(result.status !== 'success'){
           self.RootStore.uIStore.showMsg('warning', result.errors[0].description, result.errors[0].code);
         }

       });
     }

     var type = id.substring(0,4);
     console.log('type ====================> ', type);

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
              self.RootStore.uIStore.showMsg('warning', result.errors[0].description, result.errors[0].code);
            }

          });
        }

        var type = id.substring(0,4);

        switch (type) {
          case 'chg_':
            await self.getCharge(id).then(async charge => {
                if(charge.status == 200){
                    transaction = charge;
                    if(charge.data.status && charge.data.status.toUpperCase() === 'CAPTURED'){
                      console.log('CAPTURED', charge.data);

                      if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
                        document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = 'Successful';
                      }
                      else {
                        self.RootStore.uIStore.showMsg('success', "Successful Transaction", charge.data.id);
                      }
                    }
                    else {
                      if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
                        document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = charge.data.response.message;
                      }
                      else {
                        self.RootStore.uIStore.showMsg('warning', charge.data.response.message, charge.data.id);
                      }

                    }
              }
              else {
                console.log('error', charge);
                self.RootStore.uIStore.showMsg('error', charge.data.errors[0].description, null);
              }
            });
            break;
          case 'auth':
            console.log('In auth');
            await self.getAuthorize(id).then(async auth => {
              console.log('auth res', auth);
              if(auth.status == 200){
                  transaction = auth;
                  if(auth.data.status && auth.data.status.toUpperCase() === 'AUTHORIZED'){
                    console.log('CAPTURED', auth.data);
                    console.log('uIStore', self.RootStore.uIStore.notifications);

                    if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
                      document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = 'Successful';
                    }
                    else {
                      self.RootStore.uIStore.showMsg('success', "Successful Transaction", auth.data.id);
                    }
                  }
                  else {
                    if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
                      document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = auth.data.response.message;
                    }
                    else {
                      self.RootStore.uIStore.showMsg('warning', auth.data.response.message, auth.data.id);
                    }

                  }

              }
              else {
                console.log('error', auth.data);
                self.RootStore.uIStore.showMsg('error', auth.data.errors[0].description, null);
              }
            });
            break;
        }

        console.log('I am here', transaction);
        return await transaction;

      }

  //
  // async getTransaction(id){
  //    var self = this;
  //
  //    var body = {
  //      "mode": "Production",
  //      "headers": {
  //        "authorization": "Bearer " + this.RootStore.configStore.gateway.publicKey,
  //      }
  //    }
  //
  //    var res = null, data = null, transaction = null;
  //    await axios.post(this.RootStore.configStore.location +'/init', body)
  //    .then(async function (response) {
  //
  //      res = response.data;
  //      console.log('key api', res);
  //
  //      if(res.status === 'success'){
  //
  //        data = res.data;
  //        self.mode = data.live_mode;
  //        self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
  //        self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
  //        self.RootStore.merchantStore.session = data.session_token;
  //
  //        self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
  //        self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
  //        self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;
  //
  //        self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
  //        self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);
  //
  //        var type = id.substring(0,4);
  //        console.log('type ====================> ', type);
  //
  //        switch (type) {
  //          case 'chg_':
  //            transaction = await self.getCharge(id);
  //            break;
  //          case 'auth':
  //            transaction = await self.getAuthorize(id);
  //            break;
  //        }
  //
  //      }
  //      else {
  //        self.RootStore.uIStore.showMsg('warning', res.errors[0].description, res.errors[0].code);
  //
  //      }
  //    })
  //    .catch(function (error) {
  //      console.log(error);
  //    });
  //
  //
  //    if(res.status === 'success' && transaction.status == 200){
  //      return await res;
  //    }
  //    else {
  //      return await null;
  //    }
  //
  //  }

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
    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {
      res = response;

      if(response.data.code == 100){
          self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }

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
    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {
      res = response;

      if(response.data.code == 100){
         self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }
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
    await axios.post(this.RootStore.configStore.location + '/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.code != 100){
        if(response.status != 200){
          console.log('error', res);

          self.RootStore.uIStore.setErrorHandler({
            visable: true,
            code: res.status,
            msg: res.message,
            type: 'error'
          });

        }
      }
      else {
        self.RootStore.uIStore.showMsg('warning', res.message, res.code);
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

    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {

       res = response.data;

       if(res.code != 100){
         if(response.status == 200){
           console.log(res);

           setTimeout(function(){
             self.RootStore.uIStore.setErrorHandler({
               visable: true,
               code: 'success',
               msg: 'The card has been deleted Successfully!',
               type: 'success'
             });
           }, 200);

         }
         else {
           console.log("result", res);

           self.RootStore.uIStore.setErrorHandler({
             visable: true,
             code: 'error',
             msg: 'Something went wrong!',
             type: 'error'
           });

         }
       }
       else {
         self.RootStore.uIStore.showMsg('warning', res.message, res.code);
       }

    })
    .catch(function (error) {
      console.log("error", error);
    });

    return await res;
  }

  async updateCardsList(){
    var self = this;

    var headers = {
      'session_token':self.RootStore.merchantStore.session
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id,
      "headers": headers
    }

    var res = null;

    await axios.post(this.RootStore.configStore.location + '/api', body)
    .then(async function (response) {
      res = response.data;

      console.log('get cards response', res);

      if(res.code != 100){
        if(response.status == 200){
          console.log('cards list', res.data);
          self.RootStore.paymentStore.setCards(res.data);

        }
        else {
          console.log('error', res);
        }
      }else{
        self.RootStore.uIStore.showMsg('warning', res.message, res.code);
      }

    })
    .catch(function (error) {
      console.log('error', error);
      // self.RootStore.uIStore.setErrorHandler({
      //   visable: true,
      //   code: error.status ? error.status : null,
      //   msg: error.message ? error.message : null,
      //   type: 'error'
      // });
    });
    return await res;
  }

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
    await axios.post(this.RootStore.configStore.location + '/api', body)
    .then(async function (response) {
      res = response;
      console.log('token', res);

      if(response.data.code != 100){
        if(res.status != 200){
          var error = res.data;
          console.log('error', error);

          self.RootStore.uIStore.setErrorHandler({
            visable: true,
            code: error.status,
            msg: error.message,
            type: 'error'
          });

        }
      }
      else {
        self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
      }

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
    await axios.post(this.RootStore.configStore.location + '/api', body)
    .then(async function (response) {
      res = response;

      console.log('get customer response', res);

      if(response.data.code != 100){
        if(res.status == 200){
          console.log('customer', res.data);
          self.RootStore.configStore.customer = res.data;
        }
        else {
          console.log('error', res);
        }
      }
      else {
        self.RootStore.uIStore.showMsg('warning', response.data.message, response.data.code);
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
          self.createCard(self.RootStore.configStore.customer.id, token);
        }
      });
    }
  }

  async createCard(customer_id, token){
    var self = this;

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

    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {

      res = response.data;

      console.log('charge', res);

      if(res.code != 100){
        if(response.status == 200){
          console.log('card', res);
          self.RootStore.uIStore.showMsg('success', 'The card has been saved!', res.id);
        }
        else {
          console.log('error', res);

          // self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
          //
          // setTimeout(function(){
            self.RootStore.uIStore.showMsg('error', res.errors[0].description, null);
          // }, 1000);
        }
      }
      else {
        self.RootStore.uIStore.showMsg('warning', res.message, res.code);
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
    await axios.post(this.RootStore.configStore.location + '/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.code != 100){
        if(response.status == 200){

          console.log('otp auth', res);
          if(res.status === 'INITIATED'){
            window.open(res.transaction.url, '_self');
          }
          else if(res.status === 'CAPTURED'){
            self.RootStore.uIStore.showMsg('success', 'Captured Transaction', res.id);
          }
          else if(res.status === 'AUTHORIZED'){
            self.RootStore.uIStore.showMsg('success', 'Authorized Transaction', res.id);
          }
          else {
            self.RootStore.uIStore.showMsg('error', res.response.message, res.id);
          }
        }
        else {
          console.log('error', res);
          self.RootStore.uIStore.showMsg('error', res.errors[0].description, null);
        }
      }else {
        self.RootStore.uIStore.showMsg('warning', res.message, res.code);
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
    await axios.post(this.RootStore.configStore.location +'/api', body)
    .then(async function (response) {

      res = response.data;
      console.log('request authentication', res);

      if(res.code != 100){
        if(response.status == 200){
          console.log('res', res);

          if(res.status === 'DECLINED'){
            self.RootStore.uIStore.setErrorHandler({});

            // self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
            //
            // setTimeout(function(){
              self.RootStore.uIStore.showMsg('error', res.response.message, res.id);
            // }, 1000);

          }else {
            self.RootStore.uIStore.setErrorHandler({
              visable: true,
              code: res.response.code,
              msg: res.response.message,
              type: 'success'
            });
          }
        }
        else {

          self.RootStore.uIStore.setErrorHandler({});

          // self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
          //
          // setTimeout(function(){
            self.RootStore.uIStore.showMsg('error', res.errors[0].description, null);
          // }, 1000);
        }
      }else {
        self.RootStore.uIStore.showMsg('warning', res.message, res.code);
      }

    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }

}

decorate(ApiStore, {
  mode: observable
});

export default ApiStore;
