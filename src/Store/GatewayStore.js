import {decorate, observable, computed} from 'mobx';
import axios from 'axios';
import mainStore from '../Store/MainStore.js';

class gatewayStore{

  constructor() {
    this.paymentMethods = {};
    this.settlement_currency = null;
    this.supported_currencies = {};
    this.cards = {};

    this.webPayments = [];
    this.cardPayments = [];

    this.currentAmount = 0;
    this.currentCurrency = {};
    this.customerCurrency = {};

    this.mode = null;
    this.url = null;

    this.activePage = 0;
    this.pageIndex = 1;

    this.width = window.innerWidth;
    this.isMobile = window.innerWidth <= 500 ? true : false;

    this.isMobile ? this.subPage = 0 : this.subPage = -1;

    this.dir = 'ltr';

    this.isLoading = true;

    this.setPageIndex(0);

  }

  computed
  get getPageIndex(){
    return this.pageIndex;
  }

  setPageIndex(value){
    this.pageIndex = value;
  }


  computed
  get getLoadingStatus(){
    return this.isLoading;
  }

  setLoadingStatus(value){
      this.isLoading = value;
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  computed
  get getMode(){
    return this.mode;
  }

  computed
  get getURL(){
    return this.url;
  }

  setCards(value){
    this.cards = value;
  }

  computed
  get getCards(){
    return this.cards;
  }

  setCurrentAmount(value){
    this.currentAmount = value;
  }

  setCurrentAmount(value){
    this.currentAmount = value;
  }

  computed
  get getCurrentAmount(){
    return this.currentAmount;
  }

  setCustomerCurrency(value){
    this.customerCurrency = value;
  }

  computed
  get getCustomerCurrency(){
    return this.customerCurrency;
  }

  setPaymentMethods(data, currency){

    if(data != null){

      data = JSON.parse(data);
      console.log('payment', data);
      console.log('currency', currency);
      this.paymentMethods = data.payment_methods;
      this.setSettlementCurrency(data.settlement_currency);
      this.setSupportedCurrencies(data.supported_currencies);
      this.setCards(data.cards);

      this.sort();

      if(Array.isArray(this.getSupportedCurrencies) && this.getSupportedCurrencies.length > 0){
        var self = this;
        this.getSupportedCurrencies.forEach(function(cur){
          if(cur.currency === currency){
            self.setCurrentCurrency(cur);
            self.setCustomerCurrency(cur);
            self.setCurrentAmount(cur.amount);
          }
        });
      }
      else {
        mainStore.setMsg({
              type: 'warning',
              title: 'Currency is not supported',
              desc: 'na na na'
        });
      }

      this.setLoadingStatus(false);
    }
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
  get getDir(){
    return this.dir;
  }

  computed
  get getPaymentMethods(){
    return this.paymentMethods;
  }

  computed
  get getAllWebPayments(){
    return this.webPayments;
  }

  computed
  get getWebPaymentsByCurrency(){
    if(Array.isArray(this.webPayments)){
      var self = this;
      var arr = [];
      this.webPayments.forEach(function(payment){
        var curs = payment.supported_currencies;
        for(var i = 0; i < curs.length; i++){
          if(curs[i] === self.currentCurrency.currency){
            arr.push(payment);
          }
        }
      });

      return arr;
    }
    else {
      return null;
    }
  }

  computed
  get getAllCardPayments(){
    return this.cardPayments;
  }

  computed
  get getCurrentCurrency(){
    return this.currentCurrency;
  }

  setCurrentCurrency(value){
    this.currentCurrency = value;
  }

  computed
  get getDcc(){
    return this.dcc;
  }

  setDcc(value){
    this.dcc = value;
  }

  computed
  get getCurrencyName(){
    return this.currencyName;
  }

  setCurrencyName(value){
    this.currencyName = value;
  }

  computed
  get getSettlementCurrency(){
    return this.settlement_currency;
  }

  setSettlementCurrency(value){
    this.settlement_currency = value;
  }

  computed
  get getSupportedCurrencies(){
    return this.supported_currencies;
  }

  setSupportedCurrencies(value){
    this.supported_currencies = value;
  }

  sort(){

    if(Array.isArray(this.paymentMethods)){
      var self = this;
      this.paymentMethods.forEach(function(method) {
        console.log(method.payment_type);
        if(method.payment_type === 'web'){
          self.webPayments.push(method);
        }

        if(method.payment_type === 'card'){
          self.cardPayments.push(method);
        }

      });

      console.log(self.webPayments);
    }
  }

}

decorate(gatewayStore, {

  paymentMethods: observable,
  webPayments:observable,
  cardPayments:observable,

  currentCurrency: observable,
  customerCurrency: observable,
  customerAmount: observable,

  cards: observable,

  isMobile: observable,
  width: observable,

  settlement_currency: observable,
  supported_currencies: observable,
  activePage: observable,
  pageIndex: observable,
  subPage: observable,
  expandCurrencies: observable,
  expandBusinessInfo: observable,
  isLoading: observable

});

export default new gatewayStore();
