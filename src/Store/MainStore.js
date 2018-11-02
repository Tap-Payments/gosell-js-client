import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
import businessStore from '../Store/BusinessStore.js';
import gatewayStore from '../Store/GatewayStore.js';

class mainStore{

  constructor() {

    this.mode = null;
    this.merchant = null;
    this.sk = null;
    this.pk = null;
    this.session = null;

    this.currency = null;
    this.amount = null;
    this.customer = null;

    this.charge_id = null;
    this.ref = null;
    this.tranx_desc = null;
    this.receipt = null;

    this.status_display_duration = null;
    this.otp_resend_interval = null;
    this.otp_resend_attempts = null;

    this.setMode();

    this.errorHandler = {};
    this.msg = {};
    this.isLoading = true;

  }

  setMode(){
    var host = window.location.hostname;
    var protocol = window.location.protocol;

    if(protocol === 'https:' && (host !== 'localhost' && host.match(/[a-z]/i) !== null)){
      this.mode = "Production";
    }
    else {
      this.mode = "Development";
    }
  }

  updateMode(value){
    if(value){this.mode = "Production";}
    else {this.mode = "Development";}
  }

  computed
  get getMode(){
    return this.mode;
  }

  setMerchant(value){
    this.merchant = value;
  }

  computed
  get getMerchant(){
    return this.merchant;
  }

  setSk(value){
    this.sk = value;
  }

  computed
  get getSk(){
    return this.sk;
  }

  setPk(value){
    this.pk = value;
  }

  computed
  get getPk(){
    return this.pk;
  }

  setSession(value){
    this.session = value;
  }

  computed
  get getSession(){
    return this.session;
  }

  setAmount(value){
    this.amount = value;
  }

  computed
  get getAmount(){
    return this.amount;
  }

  setCurrency(value){
    this.currency = value;
  }

  computed
  get getCurrency(){
    return this.currency;
  }

  setCustomer(value){
    this.customer = value;
  }

  computed
  get getCustomer(){
    return this.customer;
  }

  computed
  get getStatusDisplayDuration(){
    return this.status_display_duration;
  }

  setStatusDisplayDuration(value){
    this.status_display_duration = value;
  }

  computed
  get getOtpResendInterval(){
    return this.otp_resend_interval;
  }

  setOtpResendInterval(value){
    this.otp_resend_interval = value;
  }

  computed
  get getOtpResendAttempts(){
    return this.otp_resend_attempts;
  }

  setOtpResendAttempts(value){
    this.otp_resend_attempts = value;
  }
///
  computed
  get getChargeID(){
    return this.charge_id;
  }

  setChargeID(value){
    this.charge_id = value;
  }

  computed
  get getTranxDesc(){
    return this.tranx_desc;
  }
  setTranxDesc(value){
    this.tranx_desc = value;
  }

  computed
  get getRef(){
    return this.ref;
  }

  setRef(value){
    this.ref = value;
  }

  computed
  get getReceipt(){
    return this.receipt;
  }

  setReceipt(value){
    this.receipt = value;
  }

 init(pk, data){
    var self = this;

    var currency = data.currency ? data.currency : null;
    var amount = data.amount ? data.amount : 0;
    var customer = data.customer ? data.customer : null;

    var charge = data.chg_id ? data.chg_id : null;
    var tranxDesc = data.description ? data.description : null;
    var ref = data.reference ? data.reference : null;
    var receipt = data.receipt ? data.receipt : null;

    this.setAmount(amount);
    this.setCurrency(currency);
    this.setCustomer(customer);

    this.setChargeID(charge);
    this.setTranxDesc(tranxDesc);
    this.setRef(ref);
    this.setReceipt(receipt);

    var body = {
      "mode": this.getMode,
      "headers": { "content-type": "application/json","authorization": "Bearer " + pk },
      "reqBody": {
        'key': pk
      }
    }

    axios.post('http://localhost:8000/key', body)
    .then(async function (response) {

      var res = response.data;
      console.log('res', res);

      self.updateMode(res.data.live_mode);
      self.setMerchant({merchant_id: res.data.merchant_id, merchant_name: res.data.merchant_name});
      self.setPk(pk);
      self.setSk(res.data.private_key);
      self.setSession(res.data.session_token);

      self.setStatusDisplayDuration(5);
      self.setOtpResendInterval(60);
      self.setOtpResendAttempts(3);

      await self.setBusinessInfo();

      if(amount > 0 && currency != null){

        await self.setPaymentOptions();

      }
      else {
        self.setMsg({
          type: 'error',
          title: 'Something went wrong!',
          desc: 'Please contact the website admin.'
        });

        gatewayStore.setLoadingStatus(false);
      }
    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        errorCode: error.errors[0].code,
        errorMsg: error.errors[0].description,
        errorType: 'error'
      });
    });
  }

  setPaymentOptions(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ this.getPk
    }
    console.log('cus', this.getCustomer);
    var body = {
      "mode": "Development",
      "method": 'POST',
      "path": '/v2/payment/types',
      "headers": headers,
      "reqBody": {
         "customer": this.getCustomer ? this.getCustomer.id : null,
         "currency" : this.getCurrency,
         "total_amount": this.getAmount
      }
    }

    axios.post('http://localhost:8000/api', body)
    .then(function (response) {
    //  console.log(response.data.body);
     gatewayStore.setPaymentMethods(response.data.body, self.getCurrency);

    })
    .catch(function (error) {
      console.log("payment error", error);
      self.setErrorHandler({
        errorCode: error.errors[0].code,
        errorMsg: error.errors[0].description,
        errorType: 'error'
      });
    });
  }

  setBusinessInfo(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.getSk
    }

    var body = {
      "mode": this.getMode,
      "method": 'GET',
      "path": '/v2/merchant',
      "headers": headers
    }

    axios.post('http://localhost:8000/api', body)
    .then(function (response) {
      //console.log('response', response.data.body);
      businessStore.setBusiness(response.data.body);
    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        errorCode: error.errors[0].code,
        errorMsg: error.errors[0].description,
        errorType: 'error'
      });
    });
  }

  charge(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.getSk
    }

    var body = {
      "mode": this.getMode,
      "method": 'GET',
      "path": '/v2/charges',
      "headers": headers,
      "reqBody": {
          "amount": this.getAmount,
          "currency": this.getCurrency,
          "threeDSecure": true,
          "save_card": false,
          "description": "Test Description", //tranx.desc
          "statement_descriptor": "Sample", //statement_descriptor
          "reference": {
            "transaction": "txn_0001",//ref.transaction
            "order": "ord_0001" //ref.order
          },
          "receipt": {
            "email": false, //receipt.email
            "sms": true  //receipt.sms
          },
          "customer": {
            "first_name": this.getCustomer.first_name,
            "middle_name": this.getCustomer.middle_name,
            "last_name": this.getCustomer.last_name,
            "email": this.getCustomer.email,
            "phone": {
              "country_code": this.getCustomer.phone.country_code,
              "number": this.getCustomer.phone.number
            }
          },
          "source": {
            "id": "src_kw.knet"
          },
          "post": {
            "url": "http://your_website.com/post_url"
          },
          "redirect": {
            "url": "http://your_website.com/redirect_url"
          }
        }
    }

    axios.post('http://localhost:8000/api', body)
    .then(function (response) {
      //console.log('response', response.data.body);
      businessStore.setBusiness(response.data.body);
    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        errorCode: error.errors[0].code,
        errorMsg: error.errors[0].description,
        errorType: 'error'
      });
    });
  }

  authorize(){
    var self = this;

    var headers = {
      'Authorization': 'Bearer ' + this.getSk
    }

    var body = {
      "mode": this.getMode,
      "method": 'GET',
      "path": '/v2/charges',
      "headers": headers,
      "reqBody": {
          "amount": this.getAmount,
          "currency": this.getCurrency,
          "threeDSecure": true,
          "save_card": false,
          "description": "Test Description", //tranx.desc
          "statement_descriptor": "Sample", //statement_descriptor
          "reference": {
            "transaction": "txn_0001",//ref.transaction
            "order": "ord_0001" //ref.order
          },
          "receipt": {
            "email": false, //receipt.email
            "sms": true  //receipt.sms
          },
          "customer": {
            "first_name": this.getCustomer.first_name,
            "middle_name": this.getCustomer.middle_name,
            "last_name": this.getCustomer.last_name,
            "email": this.getCustomer.email,
            "phone": {
              "country_code": this.getCustomer.phone.country_code,
              "number": this.getCustomer.phone.number
            }
          },
          "source": {
            "id": "src_kw.knet"
          },
          "post": {
            "url": "http://your_website.com/post_url"
          },
          "redirect": {
            "url": "http://your_website.com/redirect_url"
          }
        }
    }

    axios.post('http://localhost:8000/api', body)
    .then(function (response) {
      //console.log('response', response.data.body);
      businessStore.setBusiness(response.data.body);
    })
    .catch(function (error) {
      console.log(error);
      self.setErrorHandler({
        errorCode: error.errors[0].code,
        errorMsg: error.errors[0].description,
        errorType: 'error'
      });
    });
  }

  computed
  get getLoadingStatus(){
    return this.isLoading;
  }

  setLoadingStatus(value){
    console.log('hi loading');
    if(this.getBusinessInfo && this.getPaymentOptions ){
      console.log('done');
      this.isLoading = value;
    }
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

decorate(mainStore, {
  mode: observable,
  merchant: observable,
  sk: observable,
  pk: observable,
  session: observable,
  status_display_duration: observable,
  otp_resend_interval: observable,
  otp_resend_attempts: observable,
  errorHandler: observable,
  msg: observable,
  isLoading: observable

});

export default new mainStore();
