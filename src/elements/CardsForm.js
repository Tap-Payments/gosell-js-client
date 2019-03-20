import React, { Component }  from 'react';
import '../assets/css/cardsForm.css';
import {observer} from 'mobx-react';
import styled from "styled-components";
import Separator from './Separator';

class CardsForm extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.cardForm();
  }

  cardForm(){
    var store = this.props.store;
    store.formStore.generateCardForm('gosell-gateway-card-form-container');
     // window.setInterval(store.formStore.checkFocus, 10);
  }

  render() {
    let store = this.props.store;
    return(
      <div style={{margin: '0px'}}>
            <form id="gosell-gateway-form-container" method="post" ref={(node) => this.cardFormRef = node} >
                <div id="gosell-gateway-card-form-container"
                    style={{pointerEvents:(store.uIStore.btn.active&&store.uIStore.btn.loader)||store.uIStore.delete_card !== null?'none':'auto',
                            opacity: (store.uIStore.btn.active && store.uIStore.btn.loader) || store.uIStore.delete_card != null ?'0.6':'1',
                            transition: 'opacity 0.3s',
                            WebkitTransition: 'opacity 0.3s'
                          }}>
                </div>
            </form>
      </div>
    );
  }
}

export default observer(CardsForm);
