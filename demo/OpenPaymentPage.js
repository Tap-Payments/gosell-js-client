import React, { Component }  from "react";
import { GoSell } from "../src";

class OpenPaymentPage extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    var self = this;

    GoSell.openPaymentGateway();

  }

  render() {

    return (
      <div className="App">
        <GoSell
           gateway={{
             publicKey:"pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
             language:"en",
             contactInfo:true,
             supportedCurrencies: ["KWD", "SAR"],
             supportedPaymentMethods: ["KNET","VISA","MASTERCARD","MADA"],
             saveCardOption:false,
             customerCards: true,
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
           }}
           customer={{
             // id:"cus_m1QB0320181401l1LD1812485",
             first_name: "Hala",
             middle_name: "A.",
             last_name: "Qutmosh",
             email: "h.qutmosh@tap.company",
             phone: {
                 country_code: "965",
                 number: "62221019"
             }
           }}
           order={{
             amount: 100,
             currency:"KWD",
             items:null,
             shipping:null,
             taxes: null
           }}
           charge={{
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
              redirect: window.location.href,
              post: window.location.href,
            }}
           />
      </div>
    );
  }
}

export default OpenPaymentPage;
