import React, { Component }  from 'react';
import security from '../assets/imgs/3d-security.svg';
import '../assets/css/btn.css';
import {Loader} from '@tap-payments/loader';
import styled from "styled-components";
import * as animationData from '../assets/json/white-loader.json';
import gatewayStore from '../Store/GatewayStore.js';

class TapButton extends Component {

  constructor(props){
    super(props);

    this.state = {
      btnColor: '#C9C9C9',
      animating: false
    }
  }

  handleClick(){
    this.props.onClick();
  }

  render() {
    const Btn = styled.button`
      width: ${this.props.width};
      height: ${this.props.height};
      background-color: ${this.props.active ? this.props.btnColor : '#C9C9C9'};
      position: absolute;
      padding: 0;
      bottom: 0;
      margin: 20px;
      border-radius: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      justify-items: center;
      align-items: center;
      border: none;
      outline: none;
      cursor: pointer;
    `
    const BtnTitle = styled.p`
      font-family: 'Roboto-Regular', sans-serif;
      font-size: 17px;
      color: #FFFFFF;
      letter-spacing: 0.79px;
      text-align: center;
      margin: 0;
      text-transform: uppercase;
    `;

    return (
      <Btn id={this.props.id} className="tap-btn"  onClick={this.handleClick.bind(this)} dir={this.props.dir}>
            <div style={{width: '30px', height: '30px', margin: '0px 10px'}}>
              <Loader
                toggleAnimation={this.props.animate}
                animationData={animationData}
                duration={5}
              />
            </div>
            <BtnTitle style={this.props.style ? this.props.style.titleStyle : {}}>{this.props.children}</BtnTitle>
            <div style={{width: '30px', height: '30px', margin: '0px 10px'}}><img src={security} width="15"/></div>
      </Btn>
    );
  }
}

export default TapButton;
