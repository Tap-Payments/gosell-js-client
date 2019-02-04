import React, { Component }  from 'react';
import styled from "styled-components";
import '../assets/css/card.css';
// import checkmark from '../assets/imgs/checkmark.svg';
// import deleteIcon from '../assets/imgs/delete.svg';
import Paths from '../../webpack/paths';
import {observer} from 'mobx-react';
import {Loader} from '@tap-payments/loader';
import * as oneRingLoader from '../assets/loader/white-loader-one-ring.json';

class Card extends Component {
  static cards = [];

  constructor(props){
    super(props);

    this.state = {
      styles: {
        height: this.props.height ? this.props.height : '100px',
        width: this.props.width ? this.props.width : '100px',
      },
      hover: {
        backgroundColor: 'white',
        boxShadow: '0px 0px 4px #2ACE00'
      },
      shake: this.props.shake,
      delete: false,
      loading: false,
      percentage: 0,
      delete_card: null,
      fade: false,
    }
  }

  componentDidMount(){
    Card.cards.push(this.cardRef);
  }

  componentWillReceiveProps(nextProps){

    this.setState({
      shake: nextProps.shake,
      delete:false
    });
  }

  handleCustomerCards(){
    this.props.store.actionStore.handleCustomerCardsClick(this.cardRef, this.props.cardObj);
  }

  deleteCard(){
    this.props.store.uIStore.delete_card = this.props.id;
    this.props.store.uIStore.shakeCards(false);

    this.setState({
      delete: true,
      shake: false
    });

    this.props.store.uIStore.setErrorHandler({
      visable: true,
      type: 'warning',
      code: 'Delete Card',
      msg: 'Are you sure you would like to delete card ●●●● ' + this.props.last4digits + '?',
      options: [
        {title: 'Confirm', action: this.confirmDeleteCard.bind(this, this.cardRef.id)},
        {title: 'Cancel', action: this.cancelDeleteCard.bind(this)},
      ]
    });
  }

  confirmDeleteCard(card_id){
    var self = this;

    this.props.store.uIStore.getErrorHandler.visable = false;


    this.setState({
        delete:true,
        loading: true
    });

  //  self.startProgressBar(0, 100);

    self.props.store.apiStore.deleteCard(this.cardRef.id, this.props.index).then(result => {
        console.log('delete card response', result);
        if(result.deleted){

          self.props.store.apiStore.updateCards().then(updatedList => {
            console.log('updated cards: ', updatedList.cards);
            self.props.store.paymentStore.setCards(updatedList.cards);
            console.log('done?????????? ', self.props.store.paymentStore.customer_cards);
            self.props.store.uIStore.delete_card = null;
            self.props.store.uIStore.shakeCards(true);

             self.setState({
                 delete: false,
                 shake: true,
                 loading: false
             });
          });
        }

    });
  }

  cancelDeleteCard(){

    this.props.store.uIStore.delete_card = null;
    this.props.store.uIStore.shakeCards(true);

    this.setState({
      delete: false,
      shake: true
    });

    this.props.store.uIStore.getErrorHandler.visable = false;
  }

  componentWillUnmount(){
    this.setState({
        delete: false,
        shake: false,
        loading: false
    });
  }

  render() {
    var store = this.props.store;

    var classname = 'tap-card-container';
    if(store.uIStore.getIsActive === 'CARD' && store.paymentStore.selected_card === this.props.id && !this.props.shake){
      classname  = 'tap-card-container tap-card-active';
    }
    else if(this.state.shake){
      classname  = 'tap-card-shake';
    }
    else if(store.uIStore.delete_card === this.props.id){
      classname  = 'tap-card-disabled';
    }

    const RemoveCard = styled.div`
      position: absolute;
      right: ${this.props.dir === 'rtl' ? '90px' : 'auto'};
      left: ${this.props.dir === 'ltr' ? '90px' : 'auto'};
      top: -7px;
      cursor: pointer;
    `
    return (
      <div className={'tap-card ' + this.state.delete_card}>

        {this.state.loading ?
        <div className="tap-progressbar-container" style={{opacity: this.state.fade ? 0 : 1}}>
          <div style={{width: '40px', height: '40px', margin: '0px 10px'}}>
            <Loader
              toggleAnimation={this.state.delete}
              animationData={oneRingLoader}
              duration={3}
            />
          </div>
        </div> :  null}

        <div
          className={classname}
          id={this.props.id}
          dataindex={this.props.index}
          ref={(node) => this.cardRef = node}
          dir='ltr'
          style={this.props.style ? Object.assign({}, this.state.styles, this.props.style) : this.state.styles}
          onClick={this.handleCustomerCards.bind(this)}>
            {this.state.shake ?
              <RemoveCard onClick={this.deleteCard.bind(this)}>
                  <img src={Paths.imgsPath + 'delete.svg'} width="18" height="18" alt="Delete the saved card"/>
              </RemoveCard>
           : null}

            <React.Fragment>
            <div className='tap-contents' style={{opacity: this.state.fade ? 0 : 1}}>{this.props.bank ? <img src={this.props.scheme} width='30'/> : <br style={{lineHeight:'1.5'}}/> }</div>
            <div className='tap-contents' style={{opacity: this.state.fade ? 0 : 1}}>
              {this.props.bank ? <img src={this.props.bank} width='30'/> : <img src={this.props.scheme} height='27'/>}
            </div>
            <div className='tap-contents' style={{opacity: this.state.fade ? 0 : 1}}>
              <div className={store.paymentStore.selected_card === this.props.id && !this.state.shake && !this.state.delete ? "checkbox show" : "checkbox"} ></div>
              <div className="last4digits">&nbsp;&nbsp;&#9679;&#9679;&#9679;&#9679; {this.props.last4digits}</div>
            </div>
            </React.Fragment>
          </div>
      </div>
    );
  }
}

export default observer(Card);
