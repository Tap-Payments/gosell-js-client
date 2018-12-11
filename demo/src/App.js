import React, { Component }  from "react";
import { GoSell } from "../../src";
import axios from 'axios';

const gatewaySettings = {
  publicKey:"pk_test_WhawgZ7epdJyfAiqLktbK12o",
  language:"en",
  contactInfo:true,
  supportedCurrencies: "all", // all | gcc | ["KWD", "SAR"]
  supportedPaymentMethods: "all", // all | ["KNET","VISA","MASTERCARD","MADA"]
  saveCardOption:true,
  customerCards: true,
  //goPay:false, //goPay in the next version
}

const customerDetails = {
  id:"cus_k4O12018170Kq11211311"
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
      this.setState({
        open: true
      });
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick.bind(this)}>click me</button>
        {this.state.enable ?
          <GoSell
            open={this.state.open}
            gateway={gatewaySettings}
            customer={customerDetails}
            order={orders}
            charge={chargeSettings} /> : null}
      </div>
    );
  }
}

export default App;
