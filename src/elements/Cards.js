import React, { Component }  from 'react';
import Card from './Card';
import '../assets/css/card.css';
import visa from '../assets/banks/Visa-01.svg';
import Label from './Label';
import {observer} from 'mobx-react';


class Cards extends Component {

  constructor(props){
    super(props);
    this.state = {
      cards: this.props.cards,
      title: 'Edit'
    }
  }

  getRef(){
    return this.cardRef;
  }

  // deleteCard(card_id, index){
  //   var self = this;
  //
  //   // console.log('index', index);
  //   // self.props.store.uIStore.startMsgLoader();
  //   //
  //   // self.props.store.apiStore.setMsg({
  //   //   type: 'loader',
  //   //   loader:{status: self.props.store.uIStore.getMsgLoaderStatus, color: 'black', duration: 5},
  //   //   title: "Processing . . . ",
  //   //   desc: null
  //   // });
  //
  //   this.props.store.apiStore.deleteCard(card_id, index).then(result => {
  //
  //     if(result.statusCode == 200){
  //       self.props.store.uIStore.stopMsgLoader();
  //       self.props.store.uIStore.slideUp(false);
  //     }
  //     else if(result.statusCode != 200){
  //       self.props.store.uIStore.stopMsgLoader();
  //     }
  //
  //     console.log('result', result);
  //
  //   });
  //
  // }

  editCards(){
    this.setState({
      title: this.props.store.uIStore.getShakeStatus ? 'Edit' : 'Cancel'
    });
    this.props.store.uIStore.shakeCards();
  }


  render() {

    var self = this;
    var cards = null;

    var store = this.props.store;

    if(store.paymentStore.customer_cards_by_currency.length > 0){
       cards = store.paymentStore.customer_cards_by_currency.map((card, index) =>
          <Card
            key={index}
            index={index}
            id={card.id}
            dir={this.props.dir}
            shake={store.uIStore.getShakeStatus}
            scheme={this.props.store.paymentStore.getCardDetails(card.scheme).image}
            bank={card.bank_logo}
            store={this.props.store}
            last4digits={card.last_four}/>
      );
    }

    if(store.paymentStore.customer_cards_by_currency.length > 0){
      return (
        <React.Fragment>
            <Label title="Recent" dir={store.uIStore.getDir} edit={this.state.title} handleClick={this.editCards.bind(this)}/>
            <div id="cards" className="tap-cards" ref={(node) => this.cardsRef = node} dir={this.props.dir} style={this.props.style ? this.props.style : null}>
                <div className="tap-cards-container">{cards}</div>
            </div>
        </React.Fragment>
      );
    }
    else{
      return(null);
    }

  }
}

export default observer(Cards);
