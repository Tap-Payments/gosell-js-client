import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/css/confirm.css';
// import back from '../assets/imgs/back-arrow.svg';
import Paths from '../../webpack/paths';
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

    if(this.props.store.uIStore.btn.active && this.props.store.uIStore.btn.loader){
      this.props.store.uIStore.warningHandler();
    }
    else {
      this.setState({
         animate: this.props.animate_btn,
         active: this.props.active_btn
      });

      this.props.store.uIStore.setIsActive(null);
      this.props.store.uIStore.stopBtnLoader();
      this.props.store.paymentStore.selected_card = null;
      document.activeElement.blur();
      setTimeout(
          function() {
              this.props.store.uIStore.setPageIndex(0, 'y');
          }
          .bind(this),
          200
      );
    }

    // this.props.store.uIStore.payBtn(false);

    // this.props.store.uIStore.goSellBtn({
    //   title: 'Confirm',
    //   active: this.props.active_btn,
    //   loader: this.props.animate_btn
    // });

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

    var height = this.props.store.uIStore.mainHeight;

    return (
        <div className={this.props.store.uIStore.getPageIndex == this.props.index ? "tap-confirm tap-confirm-fadeIn" : "tap-confirm"}>
          <div style={{height: height + 'px'}}>
            <div className="tap-confirm-back" onClick={this.handleBackClick.bind(this)}>
              <img src={Paths.imgsPath + 'back-arrow.svg'} width="43"/>
            </div>

            <div>
              {this.props.children}
            </div>
          </div>

        </div>
      );

  }
}

// <div style={{height: '86px', position:'relative'}}>
//   <TapButton
//     id="tap-confirm-btn"
//     width="90%" height="44px"
//     btnColor='#007AFF'
//     animate={this.state.animate}
//     handleClick={this.handleBtnClick.bind(this)}
//     active={this.state.active}>Confirm</TapButton>
// </div>

export default observer(Confirm);
