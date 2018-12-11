import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/css/confirm.css';
import back from '../assets/imgs/back-arrow.svg';
import TapButton from './TapButton';

class Confirm extends Component {

  constructor(props){
    super(props);
    this.state = {
      animate: this.props.animate_btn,
      active: this.props.active_btn,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      animate: nextProps.animate_btn,
      active: nextProps.active_btn,
    });
  }

  handleBackClick(){
    this.setState({
       animate: this.props.animate_btn,
       active: this.props.active_btn
    });
    this.props.store.uIStore.setIsActive(null);
    this.props.store.uIStore.stopBtnLoader();
    this.props.store.paymentStore.selected_card = null;
    this.props.store.uIStore.setPageIndex(0);

  }

  handleBtnClick(){
    if(this.state.active){
      this.setState({
         animate: true
      });

      this.props.handleBtnClick();
    }
  }

  componentWillUnmount(){
    this.setState({
      animate: false,
      active: false,
    });
  }

  render() {
    return (
        <div className={this.props.store.uIStore.confirm == this.props.index ? "tap-confirm tap-confirm-fadeIn" : "tap-confirm"}>
          <a className="tap-confirm-back" onClick={this.handleBackClick.bind(this)}>
            <img src={back} width="43"/>
          </a>

          {this.props.children}

          <TapButton
            id="tap-confirm-btn"
            width="90%" height="44px"
            btnColor='#007AFF'
            animate={this.state.animate}
            handleClick={this.handleBtnClick.bind(this)}
            active={this.state.active}>Confirm</TapButton>

        </div>
      );

  }
}

export default observer(Confirm);
