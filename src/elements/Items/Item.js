import React, { Component }  from 'react';
import styled from "styled-components";

class Item extends Component {

  constructor(props){
    super(props);
  }

  handleClick(){}

  render() {

    var align = this.props.dir === 'ltr' ? 'left' : 'right';

    const ItemContainer = styled.div`
      margin: 16px;
      height: auto;
      min-height: ${this.props.discount ? '50px' : '30px'};
    `

    const Icon = styled.div`
      background: #fff;
      border: 1px solid #e9e9e9;
      width: 40px;
      height: 40px;
      border-radius: 100%;
    `

    const ItemDescContainer = styled.div`
      margin: 0px 10px 0px 10px;
      text-align: ${this.props.dir === 'rtl' ? 'right' : 'left'};
    `

    const Title = styled.div`
      font-size: 14px;
      color: #4A4A4A;
    `

    const SubTitle = styled.div`
      font-size: 12px;
      color: #8D9094;
    `

    const Badge = styled.div`
      width: 40px;
      height: 20px;
      background: #6B6F73;
      /* font-family: Roboto-Regular; */
      font-weight: 800;
      font-size: 13px;
      color: #F0F1F2;
      -webkit-letter-spacing: 0;
      -moz-letter-spacing: 0;
      -ms-letter-spacing: 0;
      letter-spacing: 0;
      text-align: center;
      border-radius: 40px;
      margin: ${this.props.dir === 'rtl' ? '0px 20px 0px 20px' : '0px 10px 0px 10px'};
      display: inline-block;
      float: ${this.props.dir === 'rtl' ? 'right' : ''};
      @media (max-width: 767px){
        margin: 0;
      }
    `

    const TotalAmount = styled.div`
      /* font-family: Roboto-Regular; */
      font-weight: 800;
      font-size: 14px;
      color: #4A4F54;
      letter-spacing: -0.11px;
      text-align: right;
      margin: 0px 10px 0px 10px;
      display: inline-block;
      `

    const Side1 = styled.div`
      width: 50%;
      float: ${this.props.dir === 'ltr' ? 'left' : 'right'};
    `
    const Side2 = styled.div`
      width: 50%;
      float: ${this.props.dir === 'ltr' ? 'right' : 'left'};
      text-align: ${this.props.dir === 'ltr' ? 'right' : 'left'};
      margin: 19px 0px;
    `

    return (
      <ItemContainer>
        <Side1>
          {this.props.icon ?
            <Icon>
              {this.props.icon}
            </Icon>
          : null }


          <ItemDescContainer>
            <Title>
              {this.props.title}
            </Title>

            {this.props.amount_per_unit ?
              <SubTitle>
                Unit Price: {this.props.amount_per_unit}
              </SubTitle>
            : null}

            {this.props.discount ?
              <SubTitle>
                Discount: {this.props.discount}
              </SubTitle>
            : null}

          </ItemDescContainer>
        </Side1>

        <Side2>
          <Badge>
            {this.props.qty}
          </Badge>

          <TotalAmount>
            {this.props.total}
          </TotalAmount>
        </Side2>
      </ItemContainer>
    );
  }
}

export default Item;
