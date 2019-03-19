import React, { Component }  from 'react';
import styled from "styled-components";
// import {observer} from 'mobx-react';
import Paths from '../../webpack/paths';

class BackBtn extends Component {

  constructor(props){
    super(props);

    this.state = {
      width: 'auto',
      height: 'auto',
      img: null,
    }
  }

  componentWillMount(){

    // var store = this.props.store;

    this.setState({
      width: this.props.width,
      height: this.props.height,
      img: this.props.logo,
    });
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    //  checks for logo changes, and if the next logo is null
    if ((nextProps.logo  ==  this.props.logo) || !nextProps.logo ){
      return false
    } else {
      return true
    }
  }


  render() {
    // var store = this.props.store;

    // let condition = store.uIStore.isMobile && (store.uIStore.getPageIndex != 0 || store.uIStore.show_order_details);

    const BackLayer = styled.div`
      width: ${this.state.width};
      height: ${this.state.height};
      position: fixed;
      border-radius: 50%;
      background-color: black;
      opacity: ${this.props.back ? '0.4' : '0'};
      margin: ${this.props.mobile ? '12px' : '0px'};
      transition: 5s ease-in-out;
    `

    var img = this.props.dir == 'ltr' ? Paths.imgsPath + 'arrow.svg' : Paths.imgsPath + 'arrowReverse.svg';

    const Img = styled.img`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      opacity: 1;`

    return (
      <React.Fragment>
        <BackLayer onClick={(e) => this.props.back ? this.props.goBack() : null}>
          {this.props.back ?
            <Img src={img} height="25"></Img>
          : null}
        </BackLayer>
        <img src={this.state.img} width={this.state.width} height={this.state.height} style={this.props.style}/>
      </React.Fragment>
    );
  }
}

export default BackBtn;
