import React, { Component }  from "react";
import { GoSell } from "../src";

class GoSellPaymentGateway extends Component {

  constructor(props){
    super(props);
    //chg_s4K33520191109Ms012501028
    //auth_Ka304020191929n2L12501048
    this.state = {
      id: 'auth_Ka304020191929n2L12501048',
      key: 'pk_test_Vlk842B1EA7tDN5QbrfGjYzh',
      language: 'en',
      open: false
    }
  }

  componentDidMount(){
    var self = this;
    // console.log('tap_chg', this.props.match.params.id);
    // console.log('key', this.props.match.params.key);

    // this.setState({
    //   id:this.props.match.params.id,
    //   key: this.props.match.params.key
    // });

    GoSell.generateTapGateway();

  }

  render() {

    return (
      <div className="gosell-payment-gateway">

        <GoSell
           gateway={{
               publicKey:this.state.key,
               language:this.state.language,
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
            authorize={{
              id:this.state.id
            }}

       />

      </div>
    );
  }
}

export default GoSellPaymentGateway;
