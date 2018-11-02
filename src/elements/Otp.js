import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import gatewayStore from '../Store/GatewayStore.js';
import ReactCodeInput from '../lib/codeInput/src/ReactCodeInput';
import '../assets/css/otp.css';
import back from '../assets/imgs/back-arrow.svg';
import Timer from './Timer';
import TapButton from './TapButton';
import mainStore from '../Store/MainStore.js';

class Otp extends Component {

  constructor(props){
    super(props);
    this.state = {
      count: 60,
      running: false,
      animate: false,
      active: false,
      updated: false
    }
  }

  componentDidMount(){
    this.setState({
      count: mainStore.getOtpResendInterval,
      running: true
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
   this.setState({
      animate: true,
      updated: true
    });
  }

  handleBackClick(){
    gatewayStore.setPageIndex(0);
  }

  handleChange(event){
    this.setState({  updated: false, animate: false  });

    if(event.length === 6){
      this.setState({
        active: true
      });
    }
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
        <div  className={gatewayStore.getPageIndex === 1 ? "tap-otp fadeIn" : "tap-otp"} style={{height: '100%', position: 'relative'}}>
          <a className="tap-back" onClick={this.handleBackClick.bind(this)}>
            <img src={back} width="43"/>
          </a>

          <div className={this.state.animate ? "wrong-entry" : null}>
            <ReactCodeInput
              updated={this.state.updated}
              type='number'
              onChange={this.handleChange.bind(this)} 
              fields={6} {...props}/>
          </div>

          <div className="tap-details-wrapper">
            <p className="tap-otp-msg">Please enter the OTP that has been sent to <span className="tap-otp-span">+965 ••• 99•• ••19</span></p>

            <div className='tap-otp-settings' style={this.props.dir === 'ltr' ? {textAlign: 'right'} : {textAlign: 'left'}}>
            {this.state.running ?
             <Timer running={this.state.running} time={count}/> :
             <a className={!this.state.running ? "tap-resend" : "tap-resend fadeOut"}>RESEND</a>
            }
            </div>

          </div>

          <TapButton
            id="tap-confirm-btn"
            width="90%" height="44px"
            btnColor='#007AFF'
            animate={this.state.animate ? true : false}
            onClick={this.handleClick.bind(this)}
            active={this.state.active}>Confirm</TapButton>

        </div>
      );

  }
}

export default observer(Otp);
