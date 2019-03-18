import React, { Component }  from 'react';
import Row from './Row';
import Img from './Img';
import Switcher from './Switcher';
import {observer} from 'mobx-react';
import styled from "styled-components";
import CardsForm from './CardsForm';

class SaveForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      active: false,
      animate: false,
      hide: false,
    }
  }

  handleClick(){
    this.setState({
      animate: false
    });
  }

  componentWillUnmount(){
    this.setState({
      active: false,
      animate: false,
      hide: false,
    });
  }

  render() {

    let store = this.props.store;

    let styles = {
      'rowContainer': { backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
      },
      'iconStyle': {width: '100%', height: '48px', display: 'flex', flexDirection: 'row', justifyContent: store.uIStore.dir === 'ltr' ? 'left' : 'right'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px'
      }
    }

    const SaveCardContainer = styled.div`
      height: 56px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      direction: ${store.uIStore.dir};
      margin-left: ${store.uIStore.dir === 'ltr' ? '20%' : '16px'};
      margin-right: ${store.uIStore.dir === 'rtl' ? '20%' : '16px'};
    `

    const SaveCardTitle = styled.div`
      font-size: 13px;
      color: rgba(0,0,0,0.64);
      letter-spacing: -0.36px;
      text-align: left;
      width: 70%;
      direction: ${store.uIStore.dir};
      text-align: ${store.uIStore.dir === 'ltr' ? 'left': 'right'}
    `

    return(
      <div style={{margin: '0px'}}>
          <div
            id="tap-cards-form"
            ref={(node) => this.formRef = node}
            className={store.uIStore.getIsActive === 'FORM' ? 'gosell-gateway-card-form-active gosell-gateway-form-content' : 'gosell-gateway-form-content'}
            style={{ backgroundColor: 'white', display: this.state.hide ? 'none' : 'block'}}>

            <CardsForm ref="paymentForm" store={store} />

            {store.configStore.gateway && store.configStore.gateway.saveCardOption ?
            <SaveCardContainer>
              <SaveCardTitle>
                  {store.localizationStore.getContent('save_card_promotion_text', null)}
              </SaveCardTitle>
              <div style={{ width: '25%' }}>
                <Switcher
                  store={store}
                  style={{ float: store.uIStore.dir === 'ltr' ? 'right' : 'left'}} />
              </div>
              </SaveCardContainer>
            : null}

          </div>
        </div>
    );
  }
}

export default observer(SaveForm);
