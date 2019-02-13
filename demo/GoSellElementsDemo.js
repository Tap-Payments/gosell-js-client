import React, { Component }  from "react";
import { GoSellElements } from "../src";

class GoSellElementsDemo extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <div className="App">

        <GoSellElements
           gateway={{
             publicKey:"pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
             language:"en",
             supportedCurrencies:"all",
             supportedPaymentMethods:"all",
             notifications:'msg',
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
           token={true} />

           <p id="msg"></p>

           <button onClick={() => GoSellElements.submit()}>Submit</button>
      </div>
    );
  }
}

export default GoSellElementsDemo;
