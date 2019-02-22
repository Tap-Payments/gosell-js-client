import React, { Component }  from 'react';
// import security from './assets/3d-security.svg';
import {Loader} from '@tap-payments/loader';
import styled from "styled-components";
import * as animationData from './assets/white-loader.json';

class TapBtn extends Component {
  static btns = [];

  constructor(props){
    super(props);

    this.state = {
      btnColor: '#C9C9C9',
      animating: false
    }
  }

  componentDidMount(){
    TapBtn.btns.push(this.tapBtn);
  }

  handleClick(e){
   if(!this.props.animate){
     this.props.handleClick(e);
   }
  }

  render() {

    const Btn = styled.button`
      width: ${this.props.width};
      height: ${this.props.height};
      background-color: ${this.props.active ? this.props.btnColor : '#C9C9C9'};
      position: relative;
      padding: 0;
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
      pointer-events: ${this.props.active ? 'painted' : 'none'};
    `
    const BtnTitle = styled.p`
      font-family: 'Roboto-Regular', sans-serif;
      font-size: 17px;
      color: #FFFFFF;
      letter-spacing: 0.79px;
      text-align: center;
      margin: 0;
      /* text-transform: uppercase; */
      pointer-events: none;
      direction: ${this.props.dir};
      text-align: ${this.props.dir === 'ltr' ? 'left' : 'right'};
    `;

    return (
        <Btn id={this.props.id} ref={(node) => this.tapBtn = node} className="tap-btn"  onClick={this.handleClick.bind(this)}>
              <div style={{width: '30px', height: '30px', margin: '0px 10px', pointerEvents: 'none'}}>
                <Loader
                  toggleAnimation={this.props.animate}
                  animationData={animationData}
                  duration={5}
                />
              </div>
              <BtnTitle style={this.props.style ? this.props.style.titleStyle : {}}>{this.props.children}</BtnTitle>
              <div style={{width: '30px', height: '30px', margin: '0px 10px',pointerEvents: 'none'}}><img src={'https://goselljslib.b-cdn.net/imgs/3d-security.svg'} style={{width:'15px', height:'28px'}}/></div>
        </Btn>
    );
  }
}

export default TapBtn;
