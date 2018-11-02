import React, { Component }  from 'react';
import Card from './Card';
import '../assets/css/card.css';
import visa from '../assets/banks/Visa-01.svg';

class Cards extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {

    var self = this;
    var cards = null;

    if(Object.keys(this.props.cards).length > 0){
       cards = this.props.cards.map((card, index) =>
          <Card
            key={card.id}
            id={card.id}
            dir={this.props.dir}
            scheme={visa}
            bank={card.bank_logo}
            last4digits={card.last_four}
            />
      );
    }

    return (
      <div className="tap-cards-container" dir={this.props.dir} style={this.props.style ? this.props.style : null}>
          {cards}
      </div>
    );
  }
}

export default Cards;
