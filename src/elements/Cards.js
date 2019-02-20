import React, { Component }  from 'react';
import Card from './Card';
import '../assets/css/card.css';
// import visa from '../assets/banks/Visa-01.svg';
import Label from './Label';
import {observer} from 'mobx-react';


class Cards extends Component {

  constructor(props){
    super(props);
    this.state = {
      cards: this.props.cards,
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

  componentDidMount() {
    this.props.store.uIStore.edit_customer_cards = this.props.store.localizationStore.getContent('common_edit', null);
  }

  editCards(){

    if(this.props.store.uIStore.btn.active && this.props.store.uIStore.btn.loader){
      this.props.store.uIStore.warningHandler();
    }
    else {
      var shake = this.props.store.uIStore.shake_cards;
      this.props.store.uIStore.setIsActive('CARD');
      this.props.store.uIStore.shakeCards(!shake);
    }
  }

  componentWillUnmount(){
    this.props.store.uIStore.setIsActive(null);
    this.props.store.uIStore.shakeCards(false);
  }


  render() {

    // var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

    var self = this;
    var cards = null;

    var store = this.props.store;

    if(store.paymentStore.customer_cards_by_currency.length > 0){

       cards = store.paymentStore.customer_cards_by_currency.map((card, index) =>{
         var card_obj = this.props.store.paymentStore.getCardDetails(card.scheme);

         return(<Card
           key={index}
           index={index}
           cardObj={card}
           id={card.id}
           dir={this.props.dir}
           shake={store.uIStore.shake_cards}
           scheme={card_obj != null ? card_obj.image : null}
           bank={card.bank_logo}
           store={this.props.store}
           last4digits={card.last_four}/>)
       });
    }
    var cardLength = 110*cards.length + 15 + "px";
    if(store.paymentStore.customer_cards_by_currency.length > 0){
      return (
        <React.Fragment>
            <Label title={store.localizationStore.getContent('payment_options_group_title_recent', null)} dir={store.uIStore.getDir} edit={store.uIStore.edit_customer_cards} handleClick={store.uIStore.delete_card === null ? this.editCards.bind(this) : null}/>
            <div id="cards" className="tap-cards" ref={(node) => this.cardsRef = node} dir={this.props.dir} style={this.props.style ? this.props.style : null}>
                <div className="tap-cards-container" style={{width:cardLength}}>{cards}</div>
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
