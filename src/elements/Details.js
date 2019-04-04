import React, { Component }  from 'react';
import styled from "styled-components";
import {observer} from 'mobx-react';

class Details extends Component {

  constructor(props){
    super(props);
  }

  handleClick(){
    if(this.props.store.configStore.transaction_mode != 'token' && this.props.store.configStore.transaction_mode != 'save_card'){
      this.props.store.actionStore.handleBusinessInfoClick();
    }
  }

  render() {
    var store = this.props.store;

    var align = this.props.store.uIStore.dir === 'ltr' ? 'left' : 'right';

    const Container = styled.div`
      margin: ${store.configStore.items == null && store.configStore.tranx_description == null ? '22px 0px' : '10px 0px'};
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      align-items: ${this.props.store.uIStore.isMobile ? align : 'center'};
    `

    const Order = styled.div`
      color: #9D9FA4;
      font-size: 12px;
      padding-top: 5px;
      line-height: 1.2;
    `

    return (
      <Container className="details-container">
          <div onClick={this.handleClick.bind(this)}>{store.merchantStore.name}</div>

          {(store.configStore.items != null && store.configStore.items.slice().length > 0) || store.configStore.tranx_description != null ?
              <Order onClick={store.actionStore.handleOrderDetailsClick}>
                {store.uIStore.show_order_details ? store.localizationStore.getContent('close_order_details', null): store.localizationStore.getContent('view_order_details', null)}
              </Order>
          : null}
      </Container>
    );
  }
}

export default observer(Details);
