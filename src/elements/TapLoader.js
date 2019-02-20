import React, { Component }  from 'react';
import styled from "styled-components";
import '../assets/css/msg.css';
import TapButton from './TapButton';
import {Loader} from '@tap-payments/loader';
import * as shortBlackLoader from '../assets/loader/black-loader.json';
import * as shortWhiteLoader from '../assets/loader/white-loader.json';

import * as successBlackLoader from '../assets/loader/black-success-green-green.json';
import * as successWhiteLoader from '../assets/loader/white-success-green-green.json';

import * as errorBlackLoader from '../assets/loader/black-error.json';
import * as errorWhiteLoader from '../assets/loader/white-error.json';

import * as warningBlackLoader from '../assets/loader/black-warning.json';
import * as warningWhiteLoader from '../assets/loader/white-warning.json';

class TapLoader extends Component {

  constructor(props){
    super(props);
    this.state = {
      status: this.props.status,
      type: this.props.type,
      loader: null,
      second: true,
      duration: this.props.duration,
    }
  }

  componentWillMount(){
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.load(nextProps);
  }

  load(value){
    var loader = null, second = true;

    if(value.color === 'white'){
      loader = shortWhiteLoader;

      switch (value.type) {
        case 'success':
          second = successWhiteLoader;
          break;
        case 'error':
          second = errorWhiteLoader;
          break;
        case 'warning':
          second = warningWhiteLoader;
          break;

      }
    }
    else if(value.color === 'black'){
      loader = shortBlackLoader;
      switch (value.type) {
        case 'success':
          second = successBlackLoader;
          break;
        case 'error':
          second = errorBlackLoader;
          break;
        case 'warning':
          second = warningBlackLoader;
          break;

      }
    }

    this.setState({
      status: value.status,
      type: value.type,
      loader: loader,
      second: second,
      duration: value.duration,
    });
  }

  handleClose(){
    this.props.handleClose();
  }

  render() {
    let style = {position:'relative',top:((50-(Math.floor(window.innerHeight/100)%100))+"%")};

    const Btn = styled.a`
    /* font-family: 'Roboto-Regular',sans-serif; */
    font-weight: 800;
    font-size: 12px;
    color: #FFFFFF;
    background-color: transparent;
    -webkit-letter-spacing: 0.79px;
    -moz-letter-spacing: 0.79px;
    -ms-letter-spacing: 0.79px;
    letter-spacing: 0.79px;
    text-align: center;
    margin: 0 auto;
    text-transform: uppercase;
    border: 2px solid #FFF;
    border-radius: 50px;
    height: 35px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
      &:hover{
        background-color:#FFF;
        color: #737373;
        font-weight: bold;
      }
    `;

    return (
      <div className="tap-msg" style={{position:'relative',zIndex: '99999999999999'}}>
          <div className='tap-msg-wrapper' style={window.innerWidth >= 440 ? style : {color:''}}>
            <div style={{width: '60px', height: '60px', margin: 'auto'}}>
              <Loader
                toggleAnimation={this.state.status}
                animationData={this.state.loader}
                duration={this.state.type != 'loader' ? (this.state.status ? 4 : 3) : this.state.duration}
                secondData={this.state.second}
                secondDuration={10}
              //  completeIndicator={this.closeModal.bind(this)}
              />
            </div>
            <p className='tap-msg-title' style={{color: this.props.color === 'white' ? this.props.color : '#4b4847'}}>{this.props.title}</p>
            <p className="tap-msg-desc" style={{color: this.props.color === 'white' ? '#a4a5a7' : '#797777'}}>{this.props.desc}</p>
            <br/>
            {this.props.close ? <Btn onClick={this.handleClose.bind(this)}>{this.props.closeTitle}</Btn> : null}
          </div>
      </div>
    );
  }
}

export default TapLoader;
