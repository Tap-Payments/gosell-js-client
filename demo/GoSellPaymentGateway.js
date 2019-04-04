import React, { Component }  from "react";
import { GoSell } from "../src";

class GoSellPaymentGateway extends Component {

  constructor(props){
    super(props);
    //chg_s4K33520191109Ms012501028
    //auth_Ka304020191929n2L12501048
    this.state = {
      chg_id: "chg_s4X35620191247Mo120304386",//'chg_t3YP4720191258i1ZP1302137',
      auth_id: 'auth_u3L04620191259Yl4s0304104',
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
             transaction={{
               mode:'authorize',
               charge:{
                id:this.state.chg_id
               },
               authorize:{
                 id:this.state.auth_id
               }
            }}
        />

      </div>
    );
  }
}

export default GoSellPaymentGateway;
