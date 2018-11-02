import React, { Component }  from 'react';
import security from '../assets/imgs/3d-security.svg';
import '../assets/css/btn.css';
import {Loader} from '@tap-payments/loader';
import styled from "styled-components";
import * as animationData from '../assets/json/white-loader.json';
import gatewayStore from '../Store/GatewayStore.js';
import '../assets/css/msg.css';
import errorIcon from '../assets/imgs/error-icon.svg';
import AlertIcon from './AlertIcon';

class Message extends Component {

  constructor(props){
    super(props);

    this.state = {
      animating: false
    }
  }

  componentWillMount(){
    var self = this;
    setTimeout(function(){
      self.setState({
        animating: true
      });
  }, 1000);

  }

  render() {

    return (
      <div className="tap-msg" >
          <div className='tap-msg-wrapper'>
            {this.props.icon ? this.props.icon :
             <AlertIcon type={this.props.type} animate={this.state.animating}/>
            }

            <p className='tap-msg-title'>{this.props.title}</p>
            <p className="tap-msg-desc">{this.props.desc}</p>
            <br/>
          </div>
      </div>
    );
  }
}

export default Message;
