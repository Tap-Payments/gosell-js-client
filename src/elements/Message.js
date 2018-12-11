import React, { Component }  from 'react';
import security from '../assets/imgs/3d-security.svg';
import '../assets/css/btn.css';
import styled from "styled-components";
import '../assets/css/msg.css';
import errorIcon from '../assets/imgs/error-icon.svg';
import AlertIcon from './AlertIcon';
import {Loader} from '@tap-payments/loader';
import * as blackColor from '../assets/loader/black-loader.json';
import * as whiteColor from '../assets/loader/white-loader.json';

class Message extends Component {

  constructor(props){
    super(props);

    this.state = {
      animating: false
    }
  }

  componentDidMount(){
    var self = this;

   setTimeout(function(){
      self.setState({
        animating: true
      });
   }, 1500);
  }

  render() {


    return (
      <div className="tap-msg" style={{zIndex: '99999999999999'}}>
          <div className='tap-msg-wrapper'>
            {this.props.type === 'loader' ?
            <div style={{width: '50px', height: '50px', margin: '0px 10px'}}>
              <Loader
                toggleAnimation={this.props.loader.status}
                animationData={this.props.loader.color === 'white' ? whiteColor : blackColor}
                duration={this.props.loader.duration}
              />
            </div> : <AlertIcon type={this.props.type} animate={this.state.animating}/> }
            <p className='tap-msg-title' style={this.props.loader && this.props.loader.color === 'white' ? {color: 'white'} : {}}>{this.props.title}</p>
            <p className="tap-msg-desc" style={this.props.loader &&  this.props.loader.color === 'white' ? {color: 'white'} : {}}>{this.props.desc}</p>
            <br/>
          </div>
      </div>
    );
  }
}

export default Message;
