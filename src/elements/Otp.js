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
      updated: false,
      value: null
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

  handleClick(){
    var self = this;
    var store = this.props.store;

    this.setState({
      active: true,
      animate_btn: true,
      updated: false,
    });

    // setTimeout(function(){
      self.props.store.uIStore.startLoading('loader', 'Please Wait', null);
    // }, 1000);

    store.apiStore.authentication(this.props.store.paymentStore.authenticate.type, this.state.value).then(result => {

          store.uIStore.stopBtnLoader();
          store.uIStore.setIsActive(null);
          store.paymentStore.selected_card = null;

    });
  }

  handleChange(event){
    this.setState({  updated: false, animate: false, value: event});

    if(event.length === 6){
      this.setState({
        active: true
      });
    }
    else {
      this.setState({
        active: false
      });
    }
  }

  resendOTP(){
     this.setState({
       animate_btn:false,
       animate_fields:true,
       active:false,
       updated:true,
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
      className: 'reactCodeInput',
      inputStyle: {
        margin:  '0px',
        MozAppearance: 'textfield',
        width: '45px',
        borderRadius: '8px',
        fontSize: '24px',
        height: '52px',
        paddingLeft: '0px',
        color: '#535353',
        border: '1px solid #CECECE',
        textAlign: 'center',
        outlineColor: '#009AFF'
      },
      inputStyleInvalid: {
        margin:  '0px',
        MozAppearance: 'textfield',
        width: '45px',
        borderRadius: '8px',
        fontSize: '24px',
        height: '52px',
        paddingLeft: '0px',
        color: '#535353',
        border: '1px solid #CECECE',
        textAlign: 'center',
        outlineColor: '#009AFF'
      }
    }

    return (
      <Confirm index={2} store={this.props.store} animate_btn={this.state.animate_btn} active_btn={this.state.active} handleBtnClick={this.handleClick.bind(this)}>

          <div className={this.state.animate_fields ? "wrong-entry" : null}>
            <ReactCodeInput
              ref={this.props.store.uIStore.targetElement}
              autoFocus={false}
              updated={this.state.updated}
              type='otpCode'
              onChange={this.handleChange.bind(this)}
              fields={6} {...props}/>
          </div>

          <div className="tap-details-wrapper" dir={this.props.dir}>
            <p className="tap-otp-msg">Please enter the OTP that has been sent to <span className="tap-otp-span">{this.props.store.paymentStore.authenticate ? this.props.store.paymentStore.authenticate.value : null}</span></p>

            <div className='tap-otp-settings' style={this.props.dir === 'ltr' ? {textAlign: 'right'} : {textAlign: 'left'}}>
            {this.state.running ?
             <Timer running={this.state.running} time={count}/> :
             <div className={!this.state.running ? "tap-otp-resend" : "tap-otp-resend tap-otp-fadeOut"} onClick={this.resendOTP.bind(this)}>RESEND</div>
            }
            </div>

          </div>

        </Confirm>
      );

  }
}

export default observer(Otp);
