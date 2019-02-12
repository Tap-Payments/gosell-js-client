import React, { Component }  from 'react';
import styled from "styled-components";
import {observer} from 'mobx-react';

class Details extends Component {

  constructor(props){
    super(props);
  }

  handleClick(){
      this.props.store.actionStore.handleBusinessInfoClick();
  }

  render() {
    var store = this.props.store;

    var align = this.props.store.uIStore.getDir === 'ltr' ? 'left' : 'right';

    const Container = styled.div`
      margin: 10px;
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      align-items: ${this.props.store.uIStore.getIsMobile ? align : 'center'};
    `

    const Order = styled.div`
      color: #9D9FA4;
      font-size: 12px;
    `

    return (
      <Container className="details-container">
          <div onClick={this.handleClick.bind(this)}>{store.merchantStore.name}</div>

          {store.configStore.tranx_description != null ?
              <Order onClick={store.actionStore.handleOrderDetailsClick}>
                {store.uIStore.show_order_details ? "Close Order Details" : "View Order Details"}
              </Order>
          : null}
      </Container>
    );
  }
}

export default observer(Details);
