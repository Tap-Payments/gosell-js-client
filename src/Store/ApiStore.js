import {decorate, observable, computed} from 'mobx';
import axios from 'axios';

class ApiStore{

  constructor(RootStore) {
    this.RootStore = RootStore;

    this.mode = null;


    this.errorHandler = {};
    this.msg = {};

  }

 async init(tap_id){
    var self = this;

    var body = {
      "mode": "Development",
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer " + this.RootStore.configStore.gateway.publicKey,
      }
    }

    var res = null, data = null;
    await axios.post('http://localhost:8000/key', body)
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

        console.log("tap_id", tap_id);

        if(tap_id && tap_id != null){
          self.getCharge(tap_id);
        }

        // if(data.sdk_settings) {
          self.RootStore.paymentStore.status_display_duration = data.sdk_settings.status_display_duration;
          self.RootStore.paymentStore.otp_resend_interval = data.sdk_settings.otp_resend_interval;
          self.RootStore.paymentStore.otp_resend_attempts = data.sdk_settings.otp_resend_attempts;
        // }
        // else{
        //   self.RootStore.paymentStore.statusDisplayDuration = 5;
        //   self.RootStore.paymentStore.otpResendInterval = 60;
        //   self.RootStore.paymentStore.otpResendAttempts = 3;
        // }

        self.RootStore.paymentStore.card_wallet = data.permission.card_wallet;
        self.RootStore.paymentStore.setThreeDSecure(data.permission.threeDSecure);

        await self.getMerchantDetails();

        if(self.RootStore.configStore.order.amount > 0 && self.RootStore.configStore.order.currency != null){
          await self.setPaymentOptions();
        }
        else {
          self.setErrorHandler({
            visable: true,
            code: 0,
            msg: 'Something went wrong! Please contact the website admin.',
            type: 'error'
          });
        }
      }
      else {
        self.setErrorHandler({
          visable: true,
          code: res.errors[0].code,
          msg: res.errors[0].description,
          type: 'error'
        });

      }
    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });

    });

    return await res;
  }

  async setPaymentOptions(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ this.RootStore.merchantStore.sk
    }

    var mode = null;
    switch (this.RootStore.configStore.transaction_mode) {
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
         "customer": this.RootStore.configStore.customer.id,
         "currency" : this.RootStore.configStore.order.currency,
         "total_amount": this.RootStore.configStore.order.amount
      }
    }

    await axios.post('http://localhost:8000/api', body)
    .then(function (response) {

      var res = response.data;
       console.log('res', JSON.parse(res.body));

       if(res.statusCode == 200){
         console.log('currency from merchant', self.RootStore.configStore.order.currency);
         self.RootStore.paymentStore.getPaymentMethods(res.body, self.RootStore.configStore.order.currency);
       }
       else {
         self.setMsg({
           type: 'error',
           title: res.errors[0].code,
           desc: res.errors[0].description
         });
       }

    })
    .catch(function (error) {
      console.log("error", error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });
  }

  async updateCards(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ this.RootStore.merchantStore.sk
    }

    var body = {
      "mode": "Production",
      "method": 'POST',
      "path": '/v2/payment/types',
      "headers": headers,
      "reqBody": {
         "customer": this.RootStore.configStore.customer.id ? this.RootStore.configStore.customer.id : null,
         "currency" : this.RootStore.paymentStore.getCurrency,
         "total_amount": this.RootStore.paymentStore.getAmount
      }
    }

    var res = null;
    console.log('payment options api body', body);
    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {

      res = response.data;

       if(res.statusCode == 200){
         var result = JSON.parse(res.body);
         console.log(result);
         if(result.cards){
           console.log("I'm here in updateCards ---------> ",result.cards);
           await self.RootStore.paymentStore.setCards(result.cards);
         }
         else {
           await self.RootStore.paymentStore.setCards(null);
         }

       }
       else {
         self.setMsg({
           type: 'error',
           title: res.errors[0].code,
           desc: res.errors[0].description
         });
       }

    })
    .catch(function (error) {
      console.log("error", error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });

    return await res;
  }

  async getMerchantDetails(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": 'GET',
      "path": '/v2/merchant',
      "headers": headers
    }

    await axios.post('http://localhost:8000/api', body)
    .then(function (response) {

      var res = response.data;
      console.log(res);

      if(res.body){
        self.RootStore.merchantStore.setDetails(res.body);
      }
      else {
        self.setMsg({
          type: 'error',
          title: res.errors[0].code,
          desc: res.errors[0].description
        });
      }

    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });
  }

  async charge(source, type, fees){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Application': 'app_locale=en_UA|requirer=SDK|app_id=company.tap.goSellSDKExample|requirer_os=iOS|requirer_version=2.0.0|requirer_os_version=11.3',
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/charges",
      "headers": headers,
      "reqBody": {
        "id": this.RootStore.configStore.charge.id ? this.RootStore.configStore.charge.id : null,
        "amount": this.RootStore.paymentStore.current_currency.amount, //this.RootStore.configStore.order.amount,
        "currency": this.RootStore.paymentStore.current_currency.currency, //this.RootStore.configStore.order.currency,
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
        // "selected_currency":this.RootStore.paymentStore.current_currency.currency,
        // "selected_amount":this.RootStore.paymentStore.current_currency.amount
      }
    }

    console.log('change api body', body);
    var result, res = null;

    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {
      res = response.data;
      console.log('charge', res);

      if(res.statusCode == 200){
          result = JSON.parse(res.body);

          if(result.status.toUpperCase() === 'INITIATED' && type !== 'CARD'){
            console.log('INITIATED', result);

            window.open(result.transaction.url, '_self');
          }
          else if(result.status.toUpperCase() === 'CAPTURED' && type !== 'CARD'){
            console.log('CAPTURED form');
            // self.setMsg({
            //   type: 'success',
            //   title: "Successful",
            //   desc: result.id
            // });

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
            // self.setMsg({
            //   type: 'warning',
            //   title: result.response.message,
            //   desc: result.id
            // });
          }
      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);

        // self.setMsg({
        //   type: 'error',
        //   title: "Something went wrong!",
        //   desc: result.errors[0].description
        // });

        self.RootStore.uIStore.showResult('error', "Something went wrong! " + result.errors[0].description, null);

        self.setErrorHandler({
          visable: true,
          code: "Something went wrong!",
          msg: result.errors[0].description,
          type: 'error'
        });

      }
    })
    .catch(function (error) {
      console.log('error', error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });

    return await res;
  }

  async getCharge(chg_id){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/charges/"+chg_id,
      "headers": headers
    }

    var result, res = null;
    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){
        result = JSON.parse(res.body);

          if(result.status.toUpperCase() === 'CAPTURED'){
            console.log('CAPTURED', result);
            console.log('uIStore', self.RootStore.uIStore.notifications);

            if(self.RootStore.uIStore.notifications && self.RootStore.uIStore.notifications !== 'standard'){
              document.getElementById(self.RootStore.uIStore.notifications).innerHTML = 'Successful';
            }
            else {
              self.setErrorHandler({
                visable: true,
                code: result.id,
                msg: 'Successful',
                type: 'success'
              });
            }
          }
          else {
            if(self.RootStore.uIStore.notifications && self.RootStore.uIStore.notifications !== 'standard'){
              document.getElementById(self.RootStore.uIStore.notifications).innerHTML = result.response.message;
            }
            else {
              self.setErrorHandler({
                visable: true,
                code: result.id,
                msg: result.response.message,
                type: 'warning'
              });
            }

          }

      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);

        return result;

      }
    })
    .catch(function (error) {
      console.log('error', error);
      return error;
      // self.setErrorHandler({
      //   visable: true,
      //   code: error.status ? error.status : null,
      //   msg: error.message ? error.message : null,
      //   type: 'error'
      // });
    });
    return await res;
  }

  async authorize(){
    var self = this;

  }

  async deleteCard(card_id, index){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": "DELETE",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id +"/"+ card_id,
      "headers": headers
    }

    console.log('delete card', body);

    var result, res = null;
    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('delete', result);
        // self.RootStore.paymentStore.getCards.splice(index,1);

        // setTimeout(function(){
        //    //self.RootStore.paymentStore.getCards.splice(index,1);
        // }, 1000);

        self.setErrorHandler({
          visable: true,
          code: 'success',
          msg: 'The card has been deleted Successfully!',
          type: 'success'
        });
      }
      else {
        result = JSON.parse(res.body);
        console.log('error', result);
        // self.RootStore.paymentStore.getCards.splice(this.props.index, 1);

        self.setErrorHandler({
          visable: true,
          code: result.status,
          msg: result.message,
          type: 'error'
        });

        // self.setMsg({
        //   type: 'error',
        //   title: result.status,
        //   desc: result.message
        // });
      }
    })
    .catch(function (error) {
      console.log('error', error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });
    return await res;

  }

  async updateCardsList(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": "GET",
      "path": "/v2/card/"+ this.RootStore.configStore.customer.id,
      "headers": headers
    }

    var result, res = null;

    await axios.post('http://localhost:8000/api', body)
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

        self.setMsg({
          type: 'error',
          title: result.errors[0].code,
          desc: result.errors[0].description
        });
      }
    })
    .catch(function (error) {
      console.log('error', error);
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });
    return await res;
  }

  async getSavedCardToken(card){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
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
    await axios.post('http://localhost:8000/api', body)
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

        self.setErrorHandler({
          visable: true,
          code: error.status,
          msg: error.message,
          type: 'error'
        });

      }
    })
    .catch(function (error) {
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });

    return await res;
  }


  // async createCustomer(){
  //   var self = this;
  //
  //   var headers = {
  //     'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
  //     'Content-Type': 'application/json'
  //   }
  //
  //   var body = {
  //     "mode": "Production",
  //     "method": "POST",
  //     "path": "/v2/customers",
  //     "headers": headers,
  //     "reqBody": {
  //       "first_name": this.RootStore.configStore.customer.first_name,
  //       "middle_name": this.RootStore.configStore.customer.middle_name,
  //       "last_name": this.RootStore.configStore.customer.last_name,
  //       "email": this.RootStore.configStore.customer.email,
  //       "phone": {
  //         "country_code": this.RootStore.configStore.customer.phone.country_code,
  //         "number": this.RootStore.configStore.customer.phone.number
  //       },
  //       "description": this.RootStore.paymentStore.getTranxDesc,
  //       "metadata": {
  //         "udf1": "test"
  //       },
  //       "currency": this.RootStore.paymentStore.getCurrentCurrency.currency
  //     }
  //   }
  //
  //   console.log('create customer body', body);
  //
  //   await axios.post('http://localhost:8000/api', body)
  //   .then(function (response) {
  //     var res = response.data;
  //     console.log('charge', res);
  //     if(res.statusCode == 200){
  //       var body = JSON.parse(res.body);
  //       console.log(body);
  //       self.RootStore.paymentStore.setCustomer(body);
  //     }
  //     else {
  //       var error = JSON.parse(res.body);
  //       console.log('error', error);
  //
  //       self.setErrorHandler({
  //         visable: true,
  //         code: error.errors[0].code,
  //         msg: error.errors[0].description,
  //         type: 'error'
  //       });
  //
  //     }
  //   })
  //   .catch(function (error) {
  //     self.setErrorHandler({
  //       visable: true,
  //       code: error.status ? error.status : null,
  //       msg: error.message ? error.message : null,
  //       type: 'error'
  //     });
  //   });
  // }
  //
  // createCard(custmoer_id, token){
  //   var self = this;
  //
  //   var headers = {
  //     'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
  //     'Content-Type': 'application/json'
  //   }
  //
  //   var body = {
  //     "mode": "Production",
  //     "method": "POST",
  //     "path": "/v2/card/" + custmoer_id,
  //     "headers": headers,
  //     "reqBody": {
  //       "source": token
  //     }
  //   }
  //
  //   axios.post('http://localhost:8000/api', body)
  //   .then(function (response) {
  //     var res = response.data;
  //     console.log('charge', res);
  //     if(res.statusCode == 200){
  //       var body = JSON.parse(res.body);
  //       console.log('card', body);
  //     }
  //     else {
  //       var error = JSON.parse(res.body);
  //       console.log('error', error);
  //
  //       self.setErrorHandler({
  //         visable: true,
  //         code: error.errors[0].code,
  //         msg: error.errors[0].description,
  //         type: 'error'
  //       });
  //
  //     }
  //   })
  //   .catch(function (error) {
  //     self.setErrorHandler({
  //       visable: true,
  //       code: error.status ? error.status : null,
  //       msg: error.message ? error.message : null,
  //       type: 'error'
  //     });
  //   });
  // }

  // computed
  // get getLoadingStatus(){
  //   return this.isLoading;
  // }
  //
  // setLoadingStatus(value){
  //   if(this.getBusinessInfo && this.getPaymentOptions ){
  //     this.isLoading = value;
  //   }
  // }

  async chargeAuthentication(type, value){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    console.log('charge', this.RootStore.configStore.charge.id);

    var body = {
      "mode": "Production",
      "method": "POST",
      "path": "/v2/charges/authenticate/"+this.RootStore.paymentStore.charge.id,
      "headers": headers,
      "reqBody": {
        "type": type,
        "value":value
      }
    }

    console.log('charge authentication body', body);
    var result, res = null;
    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {
      res = response.data;

      if(res.statusCode == 200){

        result = JSON.parse(res.body);
        console.log('otp auth', result);

        if(result.status === 'CAPTURED'){
          // self.setErrorHandler({
          //   visable: true,
          //   type: 'success',
          //   code: result.response.code,
          //   msg: result.response.message,
          // });

          self.RootStore.uIStore.showResult('success', 'Successful Transaction', result.id);

        }
        else {
          // self.setErrorHandler({
          //   visable: true,
          //   type: 'warning',
          //   code: result.response.code,
          //   msg: result.response.message,
          // });
          self.RootStore.uIStore.showResult('error', result.response.message, result.id);

        }

      }
      else {
        var error = JSON.parse(res.body);
        console.log('error', error);

        self.setErrorHandler({
          visable: true,
          code: error.errors[0].code,
          msg: error.errors[0].description,
          type: 'error'
        });

        self.RootStore.uIStore.showResult('error', error.errors[0].description, error.errors[0].code);
        //self.RootStore.uIStore.setOpenModal(false);
      }
    })
    .catch(function (error) {
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });

    return await res;
  }

  async requestAuthentication(type, value){
    var self = this;

    // var id = null;
    //
    // if(this.RootStore.paymentStore.charge_id && this.RootStore.paymentStore.charge_id != null){
    //   id = this.RootStore.paymentStore.charge_id;
    // }
    // else {
    //   id = this.RootStore.paymentStore.authorize_id;
    // }

    var headers = {
      'Authorization': 'Bearer ' + this.RootStore.merchantStore.sk,
      'Content-Type': 'application/json'
    }

    var body = {
      "mode": "Production",
      "method": "PUT",
      "path": "/v2/charges/authenticate/"+ this.RootStore.paymentStore.charge.id,
      "headers": headers
    }

    console.log('request authentication body', body);

    var result, res = null;
    await axios.post('http://localhost:8000/api', body)
    .then(async function (response) {

      res = response.data;
      console.log('request authentication', res);

      if(res.statusCode == 200){
        result = JSON.parse(res.body);
        console.log('res', result);

        if(result.status === 'DECLINED'){
          self.RootStore.uIStore.showResult('error', result.response.message, result.id);

          self.setErrorHandler({
            visable: true,
            code: result.response.code,
            msg: result.response.message,
            type: 'error'
          });
        }else {
          self.setErrorHandler({
            visable: true,
            code: result.response.code,
            msg: result.response.message,
            type: 'success'
          });
        }
      }
      else {
        var error = JSON.parse(res.body);

        self.setErrorHandler({
          visable: true,
          code: error.errors[0].code,
          msg: error.errors[0].description,
          type: 'error'
        });
      }
    })
    .catch(function (error) {
      self.setErrorHandler({
        visable: true,
        code: error.status ? error.status : null,
        msg: error.message ? error.message : null,
        type: 'error'
      });
    });

    return await res;
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

}

decorate(ApiStore, {
  mode: observable,
  errorHandler: observable,
  msg: observable,
});

export default ApiStore;
