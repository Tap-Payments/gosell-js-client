import React, { Component }  from "react";
import { GoSell } from "../src";

class GoSellPaymentGateway extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('props', this.props);
    console.log('tap_chg', this.props.match.params.tap_chg);
    // console.log('token', this.props.match.params.token);
    GoSell.openPage();
  }

  render() {

    return (
      <div className="gosell-payment-gateway">
        <GoSell
           gateway={{
               publicKey:"pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
               language:"en",
               contactInfo:true,
               supportedCurrencies: 'all', // all | gcc | ["KWD", "SAR"]
               supportedPaymentMethods: "all", // all | ["KNET","VISA","MASTERCARD","MADA"]
               saveCardOption:true,
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
               id:"cus_m1QB0320181401l1LD1812485",
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
             currency:"KWD"
           }}
           charge={{
            // id: this.props.match.params.tap_chg,
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
             redirect: "http://localhost:3000",
             post: "http://localhost:3000"
         }}
           />
      </div>
    );
  }
}

export default GoSellPaymentGateway;
