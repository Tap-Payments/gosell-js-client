import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import ReactCodeInput from '../lib/codeInput/src/ReactCodeInput';
import '../assets/css/otp.css';
import back from '../assets/imgs/back-arrow.svg';
import Timer from './Timer';
import TapButton from './TapButton';
import Confirm from './Confirm';

class Otp extends Component {

  constructor(props){
    super(props);
    this.state = {
      count: 60,
      running: false,
      animate: false,
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
      animate: true
    });

    setTimeout(function(){
      self.props.store.uIStore.startLoading('loader', 'Please Wait', null);
    }, 1000);

    store.apiStore.chargeAuthentication(this.props.store.paymentStore.authenticate.type, this.state.value).then(result => {

      setTimeout(function(){
          store.uIStore.setOpenModal(false);
          store.uIStore.load = false;
          store.uIStore.isLoading = false;
          store.uIStore.stopBtnLoader();
          store.uIStore.setIsActive(null);
          store.paymentStore.selected_card = null;
       }, 5000);

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

     this.props.store.apiStore.requestAuthentication().then(result => {

         this.setState({
           animate:false,
           active:false,
           updated:true,
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
      <Confirm index={1} store={this.props.store} animate_btn={this.state.animate} active_btn={this.state.active} handleBtnClick={this.handleClick.bind(this)}>

          <div className={this.state.animate ? "wrong-entry" : null}>
            <ReactCodeInput
              updated={this.state.updated}
              type='number'
              onChange={this.handleChange.bind(this)}
              fields={6} {...props}/>
          </div>

          <div className="tap-details-wrapper">
            <p className="tap-otp-msg">Please enter the OTP that has been sent to <span className="tap-otp-span">{this.props.store.paymentStore.authenticate ? this.props.store.paymentStore.authenticate.value : null}</span></p>

            <div className='tap-otp-settings' style={this.props.dir === 'ltr' ? {textAlign: 'right'} : {textAlign: 'left'}}>
            {this.state.running ?
             <Timer running={this.state.running} time={count}/> :
             <a className={!this.state.running ? "tap-otp-resend" : "tap-otp-resend tap-otp-fadeOut"} onClick={this.resendOTP.bind(this)}>RESEND</a>
            }
            </div>

          </div>

        </Confirm>
      );

  }
}

export default observer(Otp);
