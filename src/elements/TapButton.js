import React, { Component }  from 'react';
import Paths from '../../webpack/paths';
// import security from '../assets/imgs/3d-security.svg';
import {Loader} from '@tap-payments/loader';
import styled from "styled-components";
import {observer} from 'mobx-react';
import * as animationData from '../assets/loader/white-loader.json';

class TapButton extends Component {
  static btns = [];

  constructor(props){
    super(props);
    this.state = {
      btnColor: '#C9C9C9',
      animating: false
    }

    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
  }

  componentDidMount(){
    TapButton.btns.push(this.tapBtn);

    var self = this;
    document.addEventListener("keyup", function(event){
      self.handleOnKeyUp(event);
    });

  }

  componentWillUnmount(){
    document.removeEventListener("keyup", function(event){
      self.handleOnKeyUp(event);
    });
  }

  handleClick(e){
   if(!this.props.animate){
     this.props.handleClick(e);
   }
  }

  handleOnKeyUp(event){
    if (event.keyCode === 13 && this.props.active) {
      this.handleClick(event);
    }
  }

  render() {
    const Btn = styled.button`
      width: ${this.props.width};
      height: ${this.props.height};
      background-color: ${this.props.active ? this.props.btnColor : '#C9C9C9'};
      position: absolute;
      padding: 0;
      left: 0;
      right: 0;
      top:0;
      bottom: 0;
      margin: auto;
      /* margin: 20px; */
      border-radius: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      justify-items: center;
      align-items: center;
      border: none;
      outline: none;
      cursor: pointer;
      pointer-events: ${this.props.active ? 'painted' : 'none'};
    `
    const BtnTitle = styled.p`
      font-family: 'Roboto-Regular', sans-serif;
      font-size: 17px;
      color: #FFFFFF;
      letter-spacing: 0.79px;
      text-align: center;
      margin: 0;
      text-transform: uppercase;
      pointer-events: none;
      direction: ${this.props.dir};
      text-align: ${this.props.dir === 'ltr' ? 'left' : 'right'};
    `;

    return (
        <Btn id={this.props.id} ref={(node) => this.tapBtn = node} className="tap-btn"  onClick={this.handleClick.bind(this)} onKeyUp={this.handleOnKeyUp.bind(this)}>
              <div style={{width: '30px', height: '30px', margin: '0px 10px', pointerEvents: 'none'}}>
                <Loader
                  toggleAnimation={this.props.animate}
                  animationData={animationData}
                  duration={5}
                />
              </div>
              <BtnTitle style={this.props.style ? this.props.style.titleStyle : {}}>{this.props.children}</BtnTitle>
              <div style={{width: '30px', height: '30px', margin: '0px 10px',pointerEvents: 'none'}}><img src={Paths.imgsPath + '3d-security.svg'} style={{width:'15px', height:'28'}}/></div>
        </Btn>
    );
  }
}

export default observer(TapButton);
