import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class ApiStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.mode = null;

  }

 async init(){
    var self = this;

    this.RootStore.uIStore.dir = this.RootStore.configStore.language === 'ar' ? 'rtl' : 'ltr';

    var body = {
      "mode": "Development",
      "headers": {
        "authorization": "Bearer " + this.RootStore.configStore.gateway.publicKey,
      }
    }

    var res = null, data = null, payment = null, merchant = null;
    await axios.post('http://35.237.168.102/key', body)
    .then(async function (response) {

      res = response.data;
      console.log('key api', res);

      if(res.status === 'success'){

        data = res.data;
        self.mode = data.live_mode;
        self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
        self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
        self.RootStore.merchantStore.sk = data.private_key;
        self.RootStore.merchantStore.session = data.session_token;

        self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
        self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
        self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;

        self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
        self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);

        merchant = await self.getMerchantDetails();

        payment = await self.setPaymentOptions();

      }
      else {
        self.RootStore.uIStore.showResult('warning', res.errors[0].description, res.errors[0].code);

      }
    })
    .catch(function (error) {
      console.log(error);
    });

      if(res.status === 'success' && payment.statusCode == 200 && merchant.statusCode == 200){
         this.RootStore.uIStore.stopLoading();
         return await res;
       }
       else {
         return await null;
       }

  }

  async setPaymentOptions(){
    var self = this;
    var headers = {
      'Authorization': 'Bearer '+ this.RootStore.merchantStore.sk,
      //'session_token':self.RootStore.merchantStore.session
    }

    console.log('session', headers);

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
         "currency" : this.RootStore.configStore.order ? this.RootStore.configStore.order.currency : null,
         "total_amount": this.RootStore.configStore.order ? this.RootStore.configStore.order.amount : 0
      }
    }

    var res = null, data = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(function (response) {

      res = response.data;
      data =  JSON.parse(response.data.body);
      console.log('res', res);

       if(res.statusCode == 200){
         self.RootStore.paymentStore.getPaymentMethods(res.body, self.RootStore.configStore.order ? self.RootStore.configStore.order.currency : null);
       }
       else {
         self.RootStore.uIStore.showResult('warning', data.errors[0].description, data.errors[0].code);
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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
    }

    var body = {
      "mode": "Production",
      "method": 'GET',
      "path": '/v2/merchant',
      "headers": headers
    }

    var res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(function (response) {

      res = response.data;
      console.log(res);

      if(res.body){
        self.RootStore.merchantStore.setDetails(res.body);
      }
      else {
        // self.setMsg({
        //   type: 'error',
        //   title: res.errors[0].code,
        //   desc: res.errors[0].description,
        //   handleClose: true
        // });

         self.RootStore.uIStore.showResult('warning', res.errors[0].description, res.errors[0].code);
      }

    })
    .catch(function (error) {
      console.log(error);
      // self.RootStore.uIStore.setErrorHandler({
      //   visable: true,
      //   code: error.status ? error.status : null,
      //   msg: error.message ? error.message : null,
      //   type: 'error'
      // });
    });

    return await res;
  }

  async handleTransaction(source, type, fees){
    var transaction = null;
    switch (this.RootStore.configStore.transaction_mode) {
      case 'charge':
        transaction = this.charge(source, type, fees)
        break;
      case 'authorize':
        transaction = this.authorize(source, type, fees)
        break;
      // case 'saveCard':
      //   transaction = this.saveCard();
      //   break;
    }

    return await transaction;
  }

  async charge(source, type, fees){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
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

    console.log('change api body', body);
    var result, res = null;

    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('charge', res);

      console.log('type ==============> ', type);
      if(res.statusCode == 200){
          result = JSON.parse(res.body);

          if(result.status.toUpperCase() === 'INITIATED' && type !== 'CARD'){
            console.log('INITIATED', result);

            window.open(result.transaction.url, '_self');
          }
          else if(result.status.toUpperCase() === 'CAPTURED' && type !== 'CARD'){
            console.log('CAPTURED form');
            self.RootStore.uIStore.showResult('success', 'Successful Transaction', result.id);
          }
          else if(result.status.toUpperCase() === 'INITIATED' && type === 'CARD'){
            console.log('CAPTURED card', result);
            self.RootStore.paymentStore.charge = result;
            console.log('charge id', result.id);
            self.RootStore.paymentStore.authenticate = result.authenticate;

            if(result.authenticate && result.authenticate.status === 'INITIATED'){
              self.RootStore.uIStore.getIsMobile ? self.RootStore.uIStore.setSubPage(0) : self.RootStore.uIStore.setSubPage(-1);
              self.RootStore.uIStore.setPageIndex(1);
              self.RootStore.uIStore.confirm = 1;
            }
          }
          else {
            self.RootStore.uIStore.showResult('error', result.response.message, result.id);
            console.log('charge id', result.id);
          }
      }
      else {
        result = JSON.parse(res.body);
        self.RootStore.uIStore.showResult('error', result.errors[0].description, null);

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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
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

    console.log('authorize api body', body);

    var result, res = null;

    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('authorize', res);

      if(res.statusCode == 200){
          result = JSON.parse(res.body);

          if(result.status.toUpperCase() === 'INITIATED' && type !== 'CARD'){
            console.log('INITIATED', result);
            window.open(result.transaction.url, '_self');
          }
          else if(result.status.toUpperCase() === 'AUTHORIZED' && type !== 'CARD'){
            console.log('AUTHORIZED form');
            self.RootStore.uIStore.showResult('success', 'Authorized Transaction', result.id);
          }
          else if(result.status.toUpperCase() === 'CAPTURED' && type !== 'CARD'){
            console.log('CAPTURED form');
            self.RootStore.uIStore.showResult('success', 'Captured Transaction', result.id);
          }
          else if(result.status.toUpperCase() === 'INITIATED' && type === 'CARD'){
            console.log('CAPTURED card', result);
            self.RootStore.paymentStore.authorize = result;
            console.log('charge id', result.id);
            self.RootStore.paymentStore.authenticate = result.authenticate;

            if(result.authenticate && result.authenticate.status === 'INITIATED'){
              self.RootStore.uIStore.getIsMobile ? self.RootStore.uIStore.setSubPage(0) : self.RootStore.uIStore.setSubPage(-1);
              self.RootStore.uIStore.setPageIndex(1);
              self.RootStore.uIStore.confirm = 1;
            }
          }
          else {
            self.RootStore.uIStore.showResult('error', result.response.message, null);
          }
      }
      else {
        result = JSON.parse(res.body);
        console.log('!= 200', result);
        self.RootStore.uIStore.showResult('error', result.errors[0].description, null);

      }
    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await res;
  }


  async getTransactionResult(chg_id){
     var self = this;

     var body = {
       "mode": "Production",
       "headers": {
         "authorization": "Bearer " + this.RootStore.configStore.gateway.publicKey,
       }
     }

     var res = null, data = null, charge = null;
     await axios.post('http://35.237.168.102/key', body)
     .then(async function (response) {

       res = response.data;
       console.log('key api', res);

       if(res.status === 'success'){

         data = res.data;
         self.mode = data.live_mode;
         self.RootStore.merchantStore.merchant = {id: data.merchant_id, name: data.merchant_name};
         self.RootStore.merchantStore.pk = self.RootStore.configStore.gateway.publicKey;
         self.RootStore.merchantStore.sk = data.private_key;
         self.RootStore.merchantStore.session = data.session_token;


         self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
         self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
         self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;


         self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
         self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);

         charge = await self.getCharge(chg_id);

       }
       else {
         self.RootStore.uIStore.showResult('warning', res.errors[0].description, res.errors[0].code);

       }
     })
     .catch(function (error) {
       console.log(error);
     });


     if(res.status === 'success' && charge.statusCode == 200){
       return await res;
     }
     else {
       return await null;
     }

   }

  async getCharge(chg_id){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/charges/"+chg_id,
      "headers": headers
    }

    var result, res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){
        result = JSON.parse(res.body);

          if(result.status.toUpperCase() === 'CAPTURED'){
            console.log('CAPTURED', result);
            console.log('uIStore', self.RootStore.uIStore.notifications);

            if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
              document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = 'Successful';
            }
            else {
              self.RootStore.uIStore.showResult('success', "Successful Transaction", result.id);
            }
          }
          else {
            if(self.RootStore.configStore.gateway.notifications && self.RootStore.configStore.gateway.notifications !== 'standard'){
              document.getElementById(self.RootStore.configStore.gateway.notifications).innerHTML = result.response.message;
            }
            else {
              self.RootStore.uIStore.showResult('warning', result.response.message, result.id);
            }

          }

      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);
        self.RootStore.uIStore.showResult('error', result.errors[0].description, null);
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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
    }

    var body = {
      "mode": "Production",
      "method": "DELETE",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id +"/"+ card_id,
      "headers": headers
    }

    console.log('delete card', body);

    var result, res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('delete', result);

        // await self.updateCards().then(updatedList => {
        //   self.RootStore.paymentStore.setCards(updatedList);
        // });

      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);

        self.RootStore.uIStore.setErrorHandler({
          visable: true,
          code: result.status,
          msg: result.message,
          type: 'error'
        });

      }
    })
    .catch(function (error) {
      console.log('error', error);

    });
    return await result;

  }

  async updateCards(){
    var self = this;
    var headers = {
      'Authorization': 'Bearer '+ this.RootStore.merchantStore.sk
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
    console.log('update card', body);
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {

      res = response.data;

       if(res.statusCode == 200){
         result = JSON.parse(res.body);
         console.log(result);

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

    })
    .catch(function (error) {
      console.log("error", error);
    });

    return await result;
  }

  async updateCardsList(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id,
      "headers": headers
    }

    var result, res = null;

    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('get cards response', res);
      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('cards list', result.data);
        self.RootStore.paymentStore.setCards(result.data);

      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);
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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
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

    console.log('token body', body);
    var result, res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('token', res);

      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('get token', body);

      }
      else {
        var error = JSON.parse(res.body);
        console.log('error', error);

        self.RootStore.uIStore.setErrorHandler({
          visable: true,
          code: error.status,
          msg: error.message,
          type: 'error'
        });

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


  async createCustomer(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
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

    console.log('create customer body', body);

    var res = null, result = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('get customer response', res);
      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('customer', result);
        self.RootStore.configStore.customer = result;
      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);
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

  async saveCustomerCard(token){
    var self = this;

    self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);
    //var customer = null;
    if(this.RootStore.configStore.customer && this.RootStore.configStore.customer.id){
      var customer = this.RootStore.configStore.customer;
      this.createCard(customer.id, token);
    }
    else {
      this.createCustomer().then(result => {
        if(result.statusCode == 200){
          self.createCard(self.RootStore.configStore.customer.id, token);
        }
      });
    }
  }

  async createCard(customer_id, token){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
    }

    console.log('customer id', customer_id);

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/card/" + customer_id,
      "headers": headers,
      "reqBody": {
        "source": token
      }
    }
// card_5BXeO420kTHpxLAJNdUjqbFi
    var result = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      var res = response.data;
      console.log('charge', res);
      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('card', result);
        self.RootStore.uIStore.showResult('success', 'The card has been saved!', result.id);
      }
      else {
        var error = JSON.parse(res.body);
        console.log('error', error);

        self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);

        setTimeout(function(){
          self.RootStore.uIStore.showResult('error', error.errors[0].description, null);
        }, 1000);
      }
    })
    .catch(function (error) {
      console.log('error', error);
    });

    return await result;
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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
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

    console.log('charge authentication body', body);
    var result, res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){

        result = JSON.parse(res.body);
        console.log('otp auth', result);

        if(result.status === 'CAPTURED'){
          self.RootStore.uIStore.showResult('success', 'Captured Transaction', result.id);
        }
        else if(result.status === 'AUTHORIZED'){
          self.RootStore.uIStore.showResult('success', 'Authorized Transaction', result.id);
        }
        else {
          self.RootStore.uIStore.showResult('error', result.response.message, result.id);
        }
      }
      else {
        var error = JSON.parse(res.body);
        console.log('error', error);
        self.RootStore.uIStore.showResult('error', error.errors[0].description, null);
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
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk
    }

    var body = {
      "mode": "Production",
      "method": "PUT",
      "path": path,
      "headers": headers
    }

    console.log('request authentication body', body);

    var result, res = null;
    await axios.post('http://35.237.168.102/api', body)
    .then(async function (response) {

      res = response.data;
      console.log('request authentication', res);

      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('res', result);

        if(result.status === 'DECLINED'){
          self.RootStore.uIStore.setErrorHandler({});

          self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);

          setTimeout(function(){
            self.RootStore.uIStore.showResult('error', result.response.message, result.id);
          }, 1000);

        }else {
          self.RootStore.uIStore.setErrorHandler({
            visable: true,
            code: result.response.code,
            msg: result.response.message,
            type: 'success'
          });
        }
      }
      else {
        var error = JSON.parse(res.body);

        self.RootStore.uIStore.setErrorHandler({});

        self.RootStore.uIStore.startLoading('loader', 'Please Wait', null);

        setTimeout(function(){
          self.RootStore.uIStore.showResult('error', error.errors[0].description, null);
        }, 1000);
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
