import React, { Component }  from 'react';
import Row from './Row';
import Img from './Img';
import TapButton from './TapButton';
import Switcher from './Switcher';
import '../assets/css/CardsForm.css';
import {observer} from 'mobx-react';

class CardsForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      tap: null,
      card: null,
      active: false,
      animate: false,
      focus: false,
      hide: false
    }
  }

  //
  // componentWillMount () {
  //   const script = document.createElement("script");
  //
  //   script.src = "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js";
  //   script.async = true;
  //
  //   document.head.appendChild(script);
  //
  //   script.src = "https://secure.gosell.io/js/sdk/tapjsli.js";
  //   script.async = true;
  //
  //   document.head.appendChild(script);
  // }

  componentDidMount(){

    var tap = null;
    var self = this;
    tap = Tapjsli(this.props.store.merchantStore.pk);

    this.setState({
      tap: tap
    });

    var elements = tap.elements({});

    var style = {
     base: {
       color: '#535353 ',
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
    };

    var labels = {};

    // console.log('currency', this.props.store.paymentStore.getCurrentCurrency.currency);
    var paymentOptions = {
      currencyCode: this.props.store.paymentStore.current_currency.currency,
      labels : {
          cardNumber:"Card Number",
          expirationDate:"MM/YY",
          cvv:"CVV",
          cardHolder:"Name on Card"
        },
      paymentAllowed: ['VISA','MASTERCARD','AMEX','MADA', 'KNET'],
      TextDirection: this.props.store.paymentStore.getDir
    }

    var card = elements.create('card', {style: style}, paymentOptions);
    card.mount('#element-container');

    card.addEventListener('change', function(event) {

      console.log('event', event);

      if(event.success){
        self.props.store.uIStore.setIsActive('FORM');
      }

      if(event.loaded){
        console.log('loaded!!!!! ', event.loaded);
        self.props.store.uIStore.JSLibisLoading = true;
      }

      if(event.error){
      	if(event.error.code && (event.error.code === 409 || event.error.code === 403)){
      		//hide form here
          self.setState({
            hide: true
          });

          if(event.error.code === 403){
            self.props.store.apiStore.setErrorHandler({
              visable: true,
              code: event.error.code,
              msg: event.error.message,
              type: 'error'
            });
          }
      	}
        else {
          self.setState({
            hide: false
          });
        }

      }

      if(event.error_interactive.code === 400){
        console.log(event.error_interactive.message);
        self.props.store.apiStore.setErrorHandler({
            visable: true,
            code: event.error_interactive.code,
            msg: event.error_interactive.message,
            type: 'error'
          });
        self.props.store.paymentStore.save_card_active = false;
      }
      else {
        console.log("Why you are here?");
        //self.props.store.paymentStore.save_card_active = true;
      }

      // if(event.code==400 && event.error_interactive){
      //   self.props.store.apiStore.setErrorHandler({
      //     visable: true,
      //     code: event.code,
      //     msg: event.error_interactive,
      //     type: 'error'
      //   });
      //  //console.log('done', event.error_interactive)
      // }

    });

    window.setInterval(self.checkFocus.bind(this), 10);

    this.setState({
        card: card,
        tap: tap
      });

  }

  componentWillReceiveProps(nextProps){
    this.state.card.currency(this.props.store.paymentStore.current_currency.currency);
  }

 checkFocus() {

   var self = this;
   var statusFocus = null;

   //document.getElementByid
   var isfocused = document.getElementById("myFrame");
   //console.log('focus', isfocused);
       if(document.activeElement == isfocused) {

         if(statusFocus != false){
             //console.log('iframe has focus', this.formRef);
             statusFocus=false;
             self.props.store.actionStore.cardFormHandleClick(self.formRef);
             //return {"statusFocus":statusFocus,'message':"iframe has focus"};
         }

       } else {
         if(statusFocus != true){
             //console.log('iframe not focused');
             statusFocus=true;
             //return {"statusFocus":statusFocus,'message':"iframe has not focused"};
         }
       }

       return;
 }

  async generateToken() {
    var self = this;

    await this.state.tap.createToken(this.state.card).then(function(result) {

        if (result.error) {
              // Inform the user if there was an error
              self.props.store.apiStore.setErrorHandler({
                visable: true,
                code: 0,
                msg: result.error.message,
                type: 'error'
              });

        } else {
              // Send the token to your server
              self.props.store.apiStore.setErrorHandler({
                visable: true,
                code: 200,
                msg: result.id,
                type: 'success'
              });

              self.props.store.uIStore.setIsActive('FORM');
              self.props.store.paymentStore.source_id = result.id;
              self.props.store.paymentStore.active_payment_option = result.card;

              console.log('card token >>>>>>>>>>> ', result.card);
        }

    });

   }

   clearCardForm(){
     this.state.card.clearForm();
   }

   handleCollapse(e){
     var content = e.target.nextElementSibling;

     if(!this.state.active){
       content.style.maxHeight = null;
     }
     else {
       content.style.maxHeight = content.scrollHeight + "px";
     }

     this.setState({
       active: !this.state.active
     });
   }

  handleClick(){
    this.setState({
      animate: false
    });
  }

  handleSwitch(cb){
      this.props.store.paymentStore.saveCardOption(cb);
      this.props.store.actionStore.cardFormHandleClick(this.formRef);
  }

  render() {

    let store = this.props.store;

    let styles = {
      'rowContainer': { backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
      },
      'iconStyle': {width: '100%', height: '48px', display: 'flex', flexDirection: 'row', justifyContent: store.uIStore.getDir === 'ltr' ? 'left' : 'right'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px'
      }
    }


    return (
      <div style={{margin: '0px'}}>

          <div
            id="tap-cards-form"
            ref={(node) => this.formRef = node}
            className={store.uIStore.getIsActive === 'FORM' ? 'tap-card-active tap-form-content' : 'tap-form-content'}
            style={{ backgroundColor: 'white', display: this.state.hide ? 'none' : 'block'}}>

            <form id="form-container" method="post" ref={(node) => this.cardFormRef = node}>
                <div id="element-container"></div>
            </form>

            {store.configStore.gateway.saveCardOption ?
            <div className="tap-save-card">
              <div style={{ width: '15%'}}>

              </div>
              <div className="tap-save-msg">
                <p>
                  For faster and more secure
                  checkout, save your card
                </p>
              </div>
              <div style={{ width: '25%' }}>
                <Switcher
                  enabled={store.paymentStore.save_card_active}
                  onClick={this.handleSwitch.bind(this)}
                  style={{ float: store.uIStore.getDir === 'ltr' ? 'right' : 'left'}} />
              </div>
            </div>
            : null}

          </div>
        </div>
    );

  }
}

export default observer(CardsForm);
