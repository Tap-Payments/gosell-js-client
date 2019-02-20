import React, { Component }  from 'react';
import styled from "styled-components";
import Item from './Item';
import Separator from '../Separator';

class Items extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: null
    }
  }

  componentDidMount(){
    if(this.props.items){
      var itemsList = this.props.items.map((item, index) => {
        console.log('item', item);
        console.log('item discount', item.discount);
        if(item){
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
        }

      });

      this.setState({
        items: itemsList
      })
    }
  }

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

    return (
      <Container>
        {this.props.desc ?
            <React.Fragment>
              <Fieldset>
                {this.props.labels ? this.props.labels.desc : null}
              </Fieldset>

              <OrderDesc>
                {this.props.desc}
              </OrderDesc>
            </React.Fragment>
          : null}

        {this.props.items ?
          <React.Fragment>
            <Fieldset>
              {this.props.labels ? this.props.labels.items : null}
            </Fieldset>
            {this.state.items}
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
