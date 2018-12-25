import React, { Component }  from 'react';
import '../assets/css/cardsForm.css';
import {observer} from 'mobx-react';
import styled from "styled-components";

class CardsForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      tap: null,
      card: null,
      currency:null,
      active: false,
      animate: false,
      hide: false,
    }
  }

  componentDidMount(){
    this.cardForm();
  }

  cardForm(){
    var store = this.props.store;

    store.formStore.generateCardForm();

     window.setInterval(store.formStore.checkFocus, 10);
  }

  componentWillReceiveProps(nextProps){

    var store = nextProps.store;

    // if(nextProps.store.paymentStore.current_currency.currency != this.state.currency){
    //   store.formStore.clearCardForm();
    // }
    //
    // if(nextProps.store.uIStore.getIsActive !=='FORM'){
    //   store.formStore.clearCardForm();
    // }

    // if(this.props.store.configStore.transaction_mode !== 'get_token' && this.props.store.configStore.transaction_mode !== 'save_card'){
    // {
    //
    // }

  // }
 }

  handleClick(){
    this.setState({
      animate: false
    });
  }

  componentWillUnmount(){
    this.setState({
      tap: null,
      card: null,
      currency:null,
      active: false,
      animate: false,
      hide: false,
    });
  }

  render() {

    let store = this.props.store;

    return(
      <div style={{margin: '0px'}}>
            <form id="form-container" method="post" ref={(node) => this.cardFormRef = node}>
                <div id="element-container"></div>
            </form>
      </div>
    );
  }
}

export default observer(CardsForm);
