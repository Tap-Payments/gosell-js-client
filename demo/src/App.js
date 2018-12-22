import React, { Component }  from "react";
import { GoSell } from "../../src";
import axios from 'axios';


const gatewaySettings = {
  publicKey:"pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
  language:"en",
  contactInfo:true,
  supportedCurrencies: 'all', // all | gcc | ["KWD", "SAR"]
  supportedPaymentMethods: "all", // all | ["KNET","VISA","MASTERCARD","MADA"]
  saveCardOption:true,
  customerCards: true,
  //goPay:false, //goPay in the next version
  notifications:'standard',
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
}

const customerDetails = {
  id:"cus_m1QB0320181401l1LD1812485",
  first_name: "Hala",
  middle_name: "A.",
  last_name: "Qutmosh",
  email: "h.qutmosh@tap.company",
  phone: {
      country_code: "965",
      number: "62221019"
  }
}

const orders = {
  //id:"", next version
  amount: 100,
  currency:"KWD",
  items:null,
  shipping:null,
  taxes: null
}

const chargeSettings = {
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
   redirect: "http://localhost:3001",
   post: "http://localhost:3001"
 }

 const authorizeSettings = {
    auto:{
       type: 'VOID',
       time: 100,
    },
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
    redirect: "http://localhost:3001",
    post: "http://localhost:3001"
  }

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      open: false,
      enable: true,
      charge_id: null
    }
  }

  handleClick(){
    GoSell.open();

  }

  render() {
    return (
      <div className="App">
        <p id="test" style={{zIndex: 99999999999999999999}}></p>
        <button onClick={this.handleClick.bind(this)}>click me</button>
          <GoSell
            gateway={gatewaySettings}
            customer={customerDetails}
            order={orders}
            charge={chargeSettings}
            //authorize={authorizeSettings}
           //saveCard={true}
            // token={true}
            />
      </div>
    );
  }
}

export default App;
