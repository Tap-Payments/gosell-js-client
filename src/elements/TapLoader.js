import React, { Component }  from 'react';
import styled from "styled-components";
import {Loader} from '@tap-payments/loader';
import * as shortWhiteLoader from '../assets/white-loader.json';
import '../assets/css/style.css';

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

    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount(){
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.load(nextProps);
  }

  load(value){
    var loader  = shortWhiteLoader;

    this.setState({
      status: value.status,
      type: value.type,
      loader: loader,
      second: null,
      duration: value.duration,
    });
  }

  handleClose(){
    this.props.handleClose();
  }

  render() {
    let style = {position:'relative',top:((50-(Math.floor(window.innerHeight/100)%100))+"%")};

    return (
      <div className="gosell-gateway-msg">
          <div className='gosell-gateway-msg-wrapper' style={window.innerWidth >= 440 ? style : {color:''}}>
            <div style={{width: '60px', height: '60px', margin: 'auto', display: this.state.status ? 'block' : 'none'}}>
              <Loader
                toggleAnimation={this.state.status}
                animationData={this.state.loader}
                duration={this.state.type != 'loader' ? (this.state.status ? 4 : 3) : this.state.duration}
                secondData={this.state.second}
                secondDuration={10}
              />
            </div>
            <p className='gosell-gateway-msg-title' style={{color: this.props.color === 'white' ? this.props.color : '#4b4847'}}>{this.props.title}</p>
            <p className="gosell-gateway-msg-desc" style={{color: this.props.color === 'white' ? '#a4a5a7' : '#797777'}}>{this.props.desc}</p>
            <br/>
          </div>
      </div>
    );
  }
}

export default TapLoader;
