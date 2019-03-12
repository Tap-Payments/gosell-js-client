import React, { Component }  from 'react';
import styled from "styled-components";
import '../assets/css/card.css';
// import checkmark from '../assets/imgs/checkmark.svg';
// import deleteIcon from '../assets/imgs/delete.svg';
// import bank from '../assets/nbk.svg';
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

    var store = this.props.store;

    store.uIStore.delete_card = this.props.id;
    store.uIStore.shakeCards(false);

    this.setState({
      delete: true,
      shake: false
    });

    store.uIStore.setErrorHandler({
      visable: true,
      type: 'warning',
      code: 'Delete Card',
      msg: store.localizationStore.getContent('alert_delete_card_message', null).replace('%@', '●●●● ' + this.props.last4digits),
      options: [
        {title: store.localizationStore.getContent('alert_cancel_payment_status_undefined_btn_confirm_title', null), action: this.confirmDeleteCard.bind(this, this.cardRef.id)},
        {title: '×', action: this.cancelDeleteCard.bind(this)},
      ]
    });
  }

  confirmDeleteCard(card_id){
    var self = this;

    this.props.store.uIStore.getErrorHandler.options = [
      {title: this.props.store.localizationStore.getContent('alert_cancel_payment_status_undefined_btn_confirm_title', null)},
      {title: '×'},
    ];
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
             // calculate the modal again
             this.props.store.uIStore.calcElementsHeight('gosell-gateway-payment-options');

          });
        }
        else {

          this.props.store.uIStore.setErrorHandler({
            visable: true,
            code: result.status,
            msg: this.props.store.localizationStore.getContent('card_deleting_error', null),
            type: 'error'
          });

          self.props.store.uIStore.delete_card = null;
          self.props.store.uIStore.shakeCards(true);
          self.setState({
              delete: false,
              shake: true,
              loading: false
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

    this.props.store.uIStore.getErrorHandler.options = [
      {title: this.props.store.localizationStore.getContent('alert_cancel_payment_status_undefined_btn_confirm_title', null)},
      {title: '×'},
    ];
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

    var classname = 'gosell-gateway-card-container';
    if(store.uIStore.getIsActive === 'CARD' && store.paymentStore.selected_card === this.props.id && !this.props.shake){
      classname  = 'gosell-gateway-card-container gosell-gateway-card-active';
    }
    else if(this.state.shake){
      classname  = 'gosell-gateway-card-shake';
    }
    else if(store.uIStore.delete_card === this.props.id){
      classname  = 'gosell-gateway-card-disabled';
    }

    const RemoveCard = styled.div`
      position: absolute;
      right: ${this.props.dir === 'rtl' ? '90px' : 'auto'};
      left: ${this.props.dir === 'ltr' ? '90px' : 'auto'};
      top: -7px;
      cursor: pointer;
    `
    return (
      <div className={'gosell-gateway-card ' + this.state.delete_card}>

        {this.state.loading ?
        <div className="gosell-gateway-progressbar-container" style={{opacity: this.state.fade ? 0 : 1}}>
          <div style={{width: '40px', height: '40px', margin: '30px auto',textAlign:'center'}}>
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
            <div className='gosell-gateway-card-contents' style={{opacity: this.state.fade ? 0 : 1, paddingTop: this.state.fade? "0px" : "5px"}}>{this.props.bank ? <img src={this.props.scheme} width='30'height='100%'/> : <br style={{lineHeight:'1.5'}}/> }</div>
            <div className='gosell-gateway-card-contents' style={this.state.fade ? {opacity: 0, padding:'5px 0px'} : {opacity: 1, padding:'5px 0px'}}>
              {this.props.bank ? <img src={this.props.bank} width='30' height='100%'/> : <img src={this.props.scheme} height='27' width='100%'/>}
            </div>
            <div className='gosell-gateway-card-contents' style={{opacity: this.state.fade ? 0 : 1}}>
              <div className={store.paymentStore.selected_card === this.props.id && !this.state.shake && !this.state.delete ? "gosell-gateway-checkbox show" : "gosell-gateway-checkbox"} ></div>
              <div className="gosell-gateway-last-4-digits">&nbsp;&nbsp;&#9679;&#9679;&#9679;&#9679; {this.props.last4digits}</div>
            </div>
            </React.Fragment>
          </div>
      </div>
    );
  }
}

export default observer(Card);
