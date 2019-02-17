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
  //     self.props.store.uIStore.startLoading('loader', 'Please Wait', null);
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

  handleChange(event){
    // this.setState({  updated: false, animate: false, value: event});
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

      // this.setState({
      //   active: true
      // });
    }
    else {
      store.uIStore.goSellBtn({
        active: false
      });

      // this.setState({
      //   active: false
      // });
    }
  }

  resendOTP(){

    this.props.store.uIStore.goSellBtn({
      active: false,
      loader: false,
    });

    this.props.store.uIStore.goSellOtp({
        updated: true,
        value: event,
      });

     this.setState({
       // animate_btn:false,
       // animate_fields:true,
       active:false,
       // updated:true,
     });

     this.props.store.apiStore.requestAuthentication().then(result => {
         this.setState({
           count: this.props.store.paymentStore.otp_resend_interval,
           running: this.props.store.paymentStore.authenticate ? (this.props.store.paymentStore.authenticate.status === 'INITIATED' ? true : false)  : null
         });
     })

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
              ref={this.props.store.uIStore.targetElement}
              autoFocus={false}
              updated={this.props.store.uIStore.otp.updated}
              type='otpCode'
              onChange={this.handleChange.bind(this)}
              fields={6} {...props}/>
          </div>

          <table className="gosell-gateway-details-wrapper" dir={this.props.dir}>
          <tbody>
            <tr>
              <td className="gosell-gateway-otp-msg-container">
                <p className="gosell-gateway-otp-msg">Please enter the OTP that has been sent to <span className="gosell-gateway-otp-span">{this.props.store.paymentStore.authenticate ? this.props.store.paymentStore.authenticate.value : null}</span></p>
              </td>

              <td className='gosell-gateway-otp-settings' style={this.props.dir === 'ltr' ? {textAlign: 'right'} : {textAlign: 'left'}}>
                {this.state.running ?
                 <Timer running={this.state.running} time={count}/> :
                 <div className={!this.state.running ? "gosell-gateway-otp-resend" : "gosell-gateway-otp-resend gosell-gateway-otp-fadeOut"} onClick={this.resendOTP.bind(this)}>RESEND</div>
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
