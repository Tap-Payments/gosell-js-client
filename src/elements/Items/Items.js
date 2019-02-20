import React, { Component }  from 'react';
import styled from "styled-components";
import Item from './Item';
import Separator from '../Separator';

class Items extends Component {

  constructor(props){
    super(props);
  }

  handleClick(){}

  render() {

    const Container = styled.div`
    `
    const Fieldset = styled.div`
      display: flex;
      align-items: center;
      font-size: 12px;
      height: 20px;
      background: #c9c9c9;
      color: white;
      padding: 0px 16px;
    `

    const OrderDesc = styled.div`
      font-size: 14px;
      margin: 16px;
      `
    let itemsList = null;
    let discount = 0;

    if(this.props.items){
      itemsList = this.props.items.map((item, index) => {
        console.log('item', item);
        console.log('item discount', item.discount);
        return(
          <React.Fragment key={index}>
            <Item
              key={item.id}
              icon={null}
              title={item.name}
              amount_per_unit={item.amount_per_unit}
              discount={item.discount ? item.discount.value : null}
              qty={item.quantity}
              total={item.total_amount}
            />
            <Separator/>
          </React.Fragment>
        );
      });
    }

    return (
      <Container>
        {this.props.desc ?
            <React.Fragment>
              <Fieldset>
                Description
              </Fieldset>

              <OrderDesc>
                {this.props.desc}
              </OrderDesc>
            </React.Fragment>
          : null}

        {this.props.items ?
          <React.Fragment>
            <Fieldset>
              Items
            </Fieldset>
            {itemsList}
            <Item
              qty={this.props.items.length}
              total={this.props.total}
            />
          </React.Fragment>

        : null}

      </Container>
    );
  }
}

export default Items;
