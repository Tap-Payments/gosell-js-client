import {decorate, observable, computed} from 'mobx';

//include all the
class DemoConfigStore {

  constructor() {

    this.gateway = {
        publicKey:"pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
        language:"en",
        contactInfo:true,
        supportedCurrencies: 'all', // all | gcc | ["KWD", "SAR"]
        supportedPaymentMethods: "all", // all | ["KNET","VISA","MASTERCARD","MADA"]
        saveCardOption:true,
        customerCards: true,
        notifications:'standard',
        callback: this.callbackFunc,
        labels:{
            cardNumber:"Card Number",
            expirationDate:"MM/YY",
            cvv:"CVV",
            cardHolder:"Name on Card",
            actionButton:"Pay"
        },
        style: {
            base: {
              color: '#535353',
              lineHeight: '18px',
              fontFamily: 'sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: 'rgba(0, 0, 0, 0.26)',
                fontSize:'15px'
              }
            },
            invalid: {
              color: 'red',
              iconColor: '#fa755a '
            }
        }
      };

    this.transaction_mode = 'charge';

    // this.elements_transaction_mode = 'saveCard';

    this.customer = {
        id:"cus_m1QB0320181401l1LD1812485",//"cus_k2D15820191258y4H21302372",
        first_name: "Hala",
        middle_name: "-",
        last_name: "Q",
        email: "h.qutmosh@tap.company",
        phone: {
            country_code: "965",
            number: "62221019"
        }
      };

    this.authorize = {
        type: 'VOID',
        time: 100
    }

    this.transaction = {
         saveCard: false,
         threeDSecure: true,
         description: "Test Description",
         statement_descriptor: "Sample",
         reference:{
           transaction: "txn_0001",
           order: "ord_0001"
         },
         metadata:{},
         receipt:{
           email: false,
           sms: true
         },
         redirect: "http://localhost:3000/open-light-box-demo",
         post: "http://localhost:3000/open-light-box-demo"
      };

    this.order = {
        amount: 100,
        currency:"KWD",
        items:[{
          id:1,
          name:'item1',
          description: 'item1 desc',
          quantity:'x1',
          amount_per_unit:'KD00.000',
          discount: {
            type: 'P',
            value: '10%'
          },
          total_amount: 'KD000.000'
        },
        {
          id:2,
          name:'item2',
          description: 'item2 desc',
          quantity:'x2',
          amount_per_unit:'KD00.000',
          discount: {
            type: 'P',
            value: '10%'
          },
          total_amount: 'KD000.000'
        },
        {
          id:3,
          name:'item3',
          description: 'item3 desc',
          quantity:'x1',
          amount_per_unit:'KD00.000',
          discount: {
            type: 'P',
            value: '10%'
          },
          total_amount: 'KD000.000'
        }]
      };

    this.btnLoading = false;

    // this.updateGatewayObj = this.updateGatewayObj.bind(this);
    // this.updateCustomerObj = this.updateCustomerObj.bind(this);
    // this.updateOrder = this.updateOrder.bind(this);
  }

  callbackFunc(response){
    console.log('response from callback func', response);
  }

  updateGatewayObj(e) {
     // console.log(e.target.name, e.target.value);

    let gatewayObj = Object.assign({}, this.gateway);
    let key = e.target.name;

    if(e.target.type == 'checkbox'){
      gatewayObj[key] = e.target.checked;
      console.log(typeof gatewayObj[key], gatewayObj[key]);
    }
    else if(e.target.name == 'labels'){
      gatewayObj[key].actionButton = e.target.value;
    }
    else if((e.target.name === 'supportedCurrencies' || e.target.name === 'supportedPaymentMethods')){

      if(e.target.value === 'all' || e.target.value === 'gcc'){
        // console.log('value', e.target.value);
        gatewayObj[key] = e.target.value;
      }
      else if(e.target.value !== 'all' && e.target.value !== 'gcc'){
        // console.log('value', e.target.value);
        var value =  e.target.value;
        var val = value.split(",");
        // console.log('nanananananana', val);
        gatewayObj[key] = val;
      }

    }
    else {
      gatewayObj[key] = e.target.value;
    }

    this.gateway= gatewayObj;

    console.log('updated: ',this.gateway);
  }

  updateCustomerObj(e){
    // console.log(e.target.name, e.target.value);
    let customerObj = Object.assign({}, this.customer);
    let key = e.target.name;

    if(e.target.name === 'phone'){
      customerObj[key]['number'] = e.target.value;
    }
    else {
      customerObj[key] = e.target.value;
    }

    this.customer = customerObj;
  }

  updateOrder(e){
    // console.log(e.target.name, e.target.value);
    let orderObj = Object.assign({}, this.order);
    let key = e.target.name;

    orderObj[key] = e.target.value;

    this.order = orderObj;
  }

  updateTransaction(e){
    let tranxObj = Object.assign({}, this.transaction);
    let key = e.target.name;

    if(e.target.type == 'checkbox'){
      tranxObj[key] = e.target.checked;
      console.log(typeof tranxObj[key], tranxObj[key]);
    }
    else {
      tranxObj[key] = e.target.value;
    }

    this.transaction = tranxObj;
  }

  updateAuthorize(e){
    let authorize = Object.assign({}, this.authorize);
    let key = e.target.name;

    authorize[key] = e.target.value;
    console.log('authorize[key]', authorize[key]);

    this.authorize = authorize;

    this.transaction = Object.assign({}, this.transaction);
    this.transaction.auto = this.authorize;
    console.log('authorize', this.transaction);
    console.log('---> ', this.authorize);
  }

  updateMode(e){
    this.transaction_mode = e.target.value;

    if(this.transaction_mode === 'authorize'){
      let authorize = Object.assign({}, this.authorize);
      authorize['time'] = 100;
      authorize['type'] = 'VOID';

      this.authorize = authorize;

      this.transaction = Object.assign({}, this.transaction);
      this.transaction.auto = this.authorize;

      console.log('transaction', this.transaction);
    }

    console.log('mode', this.transaction_mode);
  }

}

decorate(DemoConfigStore, {
  gateway: observable,
  transaction_mode: observable,
  // elements_transaction_mode:observable,
  transaction: observable,
  customer: observable,
  order: observable,
  btnLoading: observable,
  authorize: observable,
});

let Store = new DemoConfigStore();
export default Store;
