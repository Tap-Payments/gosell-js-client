import React, { Component }  from 'react';
import styled from "styled-components";
import {observer} from 'mobx-react';
import Paths from '../../webpack/paths';

class BackBtn extends Component {

  constructor(props){
    super(props);

    // this.state = {
    //   width: 'auto',
    //   height: 'auto',
    //   img: null,
    //   back: false
    // }
  }

  state = {
    width: 'auto',
    height: 'auto',
    img: null,
    back: false
  }

  componentWillMount(){

    // var store = this.props.store;

    this.setState({
      width: this.props.width,
      height: this.props.height,
      img: this.props.logo,
      back: this.props.back
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      width: nextProps.width,
      height: nextProps.height,
      img: nextProps.logo,
      back: nextProps.back
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //
  //   console.log('== back 1', nextProps.back);
  //   console.log('== back 2', this.props.back);
  //   //  checks for logo changes, and if the next logo is null
  //   if ((nextProps.back  ==  this.props.back) || !nextProps.back ){
  //     return false
  //   } else {
  //     return true
  //   }
  //
  //
  // }

  componentWillUnMount(){
    console.log('== it is unmount');
  }

  render() {

    const BackLayer = styled.div`
      width: ${this.props.store.uIStore.modal.headerStyle.iconStyle.width};
      height: ${this.props.store.uIStore.modal.headerStyle.iconStyle.height};
      position: fixed;
      border-radius: 50%;
      background-color: black;
      margin: ${this.props.store.uIStore.isMobile ? '12px' : '0px'};
      transition: 5s ease-in-out;
    `

    var img = this.props.store.uIStore.dir == 'ltr' ? Paths.imgsPath + 'arrow.svg' : Paths.imgsPath + 'arrowReverse.svg';

    const Img = styled.img`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    `


    var condition = ((this.props.store.uIStore.pageIndex != 0 && this.props.store.uIStore.pageIndex != 1 && this.props.store.uIStore.pageIndex != 2) || this.props.store.uIStore.show_order_details) && this.props.store.uIStore.isMobile;

    return (
      <React.Fragment>
        <BackLayer
          style={{opacity: condition ? '0.4' : '0'}}
          onClick={(e) => condition ? this.props.store.actionStore.goBack() : null}>
            <Img src={img} style={{opacity: condition ? '1' : '0'}} height="25"></Img>
        </BackLayer>
        <img
          src={this.props.store.merchantStore.logo}
          width={this.props.store.uIStore.modal.headerStyle.iconStyle.width}
          height={this.props.store.uIStore.modal.headerStyle.iconStyle.height}
          style={this.props.store.uIStore.isMobile ? {margin: '12px',borderRadius: '50%'} : {borderRadius: '50%'}}/>
      </React.Fragment>
    );
  }
}

export default observer(BackBtn);
