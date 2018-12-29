import React, { Component }  from 'react';
import '../assets/css/cardsForm.css';
import {observer} from 'mobx-react';
import styled from "styled-components";

class CardsForm extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.cardForm();
  }

  cardForm(){
    var store = this.props.store;

    store.formStore.generateCardForm();
     window.setInterval(store.formStore.checkFocus, 10);
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
