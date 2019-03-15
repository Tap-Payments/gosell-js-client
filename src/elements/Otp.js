import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import ReactCodeInput from '../lib/codeInput/src/ReactCodeInput';
import '../assets/css/otp.css';
import Timer from './Timer';
import TapButton from './TapButton';
import Confirm from './Confirm';

class Otp extends Component {

  constructor(props){
    super(props);
    this.state = {
      count: 60,
      running: false,
      animate_btn: false,
      animate_fields:false,
      active: false,
      // updated: false,
      // value: null
    }
  }

  componentDidMount(){
    this.setState({
      count: this.props.store.paymentStore.otp_resend_interval,
      running: this.props.store.paymentStore.authenticate ? (this.props.store.paymentStore.authenticate.status === 'INITIATED' ? true : false)  : null
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.running !== prevState.running){
      switch(this.state.running) {
        case true:
          this.handleStart();
      }
    }
  }

  handleStart() {

    this.timer = setInterval(() => {
      const newCount = this.state.count - 1;
      this.setState(
        {count: newCount >= 0 ? newCount : 0}
      );
      if(this.state.count === 0){
        this.handleStop();
      }
    }, 1000);
  }

  handleStop() {
    if(this.timer) {
      clearInterval(this.timer);
      this.setState({
        running:false
      });
    }
  }

  handleReset() {
    this.setState({
      count: 0
    });
  }

  // handleClick(){
  //   var self = this;
  //   var store = this.props.store;
  //
  //   this.setState({
  //     active: true,
  //     animate_btn: true,
  //     updated: false,
  //   });
  //
  //   // setTimeout(function(){
  //     self.props.store.uIStore.startLoading('loader', self.props.store.localizationStore.getContent('please_wait_msg', null), null);
  //   // }, 1000);
  //
  //   store.apiStore.authentication(this.props.store.paymentStore.authenticate.type, this.state.value).then(result => {
  //
  //         store.uIStore.stopBtnLoader();
  //         store.uIStore.setIsActive(null);
  //         store.paymentStore.selected_card = null;
  //
  //   });
  // }

  handleKeyUpEvent(e){

    // console.log('handle key press event', e);
    // console.log('key', e.key);
    // console.log('keyCode', e.keyCode);

    var value = parseInt(e.key);
    // console.log('val', value);

    if(isNaN(value)){
      this.props.store.uIStore.setErrorHandler({
        visable: true,
        code: null,
        msg: this.props.store.localizationStore.getContent('otp_validation_msg', null),
        type: 'warning'
      });
    }

    // var key = e.charCode || e.keyCode || 0;
    // // // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
    // // // home, end, period, and numpad decimal
    // if(key == 0  || !(key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 ||
    //   (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))){
    //   this.props.store.uIStore.setErrorHandler({
    //     visable: true,
    //     code: null,
    //     msg: this.props.store.localizationStore.getContent('otp_validation_msg', null),
    //     type: 'warning'
    //   });
    // }


  }

  handleChange(event){
    // console.log('handle event change', event);
    var store = this.props.store;

    store.uIStore.goSellBtn({
      loader: false,
    });

    store.uIStore.goSellOtp({
      updated: false,
      value: event,
    });

    if(event.length === 6){
      store.uIStore.goSellBtn({
        active: true,
      });

    }
    else {
      store.uIStore.goSellBtn({
        active: false
      });
    }
  }

  resendOTP(){

    var self = this;

    this.props.store.uIStore.goSellOtp({
        value: null,
      });

     // this.setState({
     //   active:false,
     // });

     this.props.store.apiStore.requestAuthentication().then(result => {
        // console.log('result', result);
         this.setState({
           count: this.props.store.paymentStore.otp_resend_interval,
           running: this.props.store.paymentStore.authenticate ? (this.props.store.paymentStore.authenticate.status === 'INITIATED' ? true : false)  : null
         });

         this.props.store.uIStore.goSellBtn({
           active: false,
           loader: false,
         });

         ReactCodeInput.reset();

     });

  }

  componentWillUnmount(){
    this.handleStop();
    this.handleReset();
  }

  render() {

    const {count} = this.state;

    const props = {
      className: 'gosell-gateway-react-code-input',
      inputStyle: {
        MozAppearance: 'textfield',
        width: this.props.store.uIStore.getIsMobile ? '40px' : '45px',
        borderRadius: '8px',
        fontSize: '24px',
        height: '52px',
        color: '#535353',
        border: '1px solid #CECECE',
        textAlign: 'center',
        outlineColor: '#009AFF',
        margin: this.props.store.uIStore.getIsMobile ? '1%' : '2%',
        padding: this.props.store.uIStore.getIsMobile ? '0' : '0 12px',
      },
      inputStyleInvalid: {
        margin:  '40%',
        MozAppearance: 'textfield',
        width: this.props.store.uIStore.getIsMobile ? '40px' : '45px',
        borderRadius: '8px',
        fontSize: '24px',
        height: '52px',
        color: '#535353',
        border: '1px solid #CECECE',
        textAlign: 'center',
        outlineColor: '#009AFF',
        margin: this.props.store.uIStore.getIsMobile ? '1%' : '2%',
        padding: this.props.store.uIStore.getIsMobile ? '0' : '0 12px',
      }
    }

    return (
      <Confirm index={2} store={this.props.store}>

          <div className={this.state.animate_fields ? "gosell-gateway-wrong-entry" : null}>
            <ReactCodeInput
              id="otpCodes"
              ref={this.props.store.uIStore.targetElement}
              autoFocus={false}
              updated={this.props.store.uIStore.otp.updated}
              type='number'
              onChange={this.handleChange.bind(this)}
              onKeyUp={this.handleKeyUpEvent.bind(this)}
              fields={6} {...props}/>
          </div>

          <table className="gosell-gateway-details-wrapper" dir={this.props.dir}>
          <tbody>
            <tr>
              <td className="gosell-gateway-otp-msg-container">
                <p className="gosell-gateway-otp-msg">{this.props.store.localizationStore.getContent('otp_guide_text', null).replace('%@', '')} <span className="gosell-gateway-otp-span">{this.props.store.paymentStore.authenticate ? this.props.store.paymentStore.authenticate.value : null}</span></p>
              </td>

              <td className='gosell-gateway-otp-settings' style={this.props.dir === 'ltr' ? {textAlign: 'right'} : {textAlign: 'left'}}>
                {this.state.running ?
                 <Timer running={this.state.running} time={count}/> :
                 <div className={!this.state.running ? "gosell-gateway-otp-resend" : "gosell-gateway-otp-resend gosell-gateway-otp-fadeOut"} onClick={this.resendOTP.bind(this)}>{this.props.store.localizationStore.getContent('btn_resend_title', null)}</div>
                }
              </td>
            </tr>
            </tbody>
          </table>

        </Confirm>
      );

  }
}

export default observer(Otp);
