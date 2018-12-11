import React, { Component }  from 'react';
import styled from "styled-components";
import '../assets/css/card.css';
import checkmark from '../assets/imgs/checkmark.svg';
import deleteIcon from '../assets/imgs/close.svg';
import {observer} from 'mobx-react';
import CircularProgressBar from './CircularProgressBar';

class Card extends Component {

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

  componentWillReceiveProps(nextProps){

    this.setState({
      shake: nextProps.shake
    });
  }

  handleCustomerCards(){
    this.props.store.actionStore.handleCustomerCardsClick(this.cardRef);
  }

  deleteCard(){
    this.setState({
      delete: true,
      shake: false
    });

    this.props.store.apiStore.setErrorHandler({
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

 startProgressBar(count, limit) {
    // var elem = document.getElementById("myBar");
    var self= this;
    var id = setInterval(frame, 100);
    console.log('id', id);

    function frame() {
      if (count >= limit) {
        clearInterval(id);
         if(count == 100){
            self.setState({
              delete: true,
              shake: false,
              fade: true,
              delete_card: 'delete-card-width',
            });
        }
      } else {
        if(count < limit){
          count++;
          self.setState({
            percentage: count
          });
        }
      }
    }
  }

  confirmDeleteCard(card_id){
    var self = this;

    this.props.store.apiStore.getErrorHandler.visable = false;

    this.setState({
        delete:true,
        loading: true
    });

    self.startProgressBar(0, 100);

    self.props.store.apiStore.deleteCard(this.cardRef.id, this.props.index).then(result => {
        if(result.statusCode != 200){
          self.setState({
              delete: false,
              shake: true,
              loading: false
          });
        }
        else {

          self.props.store.apiStore.updateCards();

        }
    });
  }

  cancelDeleteCard(){
    this.setState({
      delete: false,
      shake: true
    });

    this.props.store.apiStore.getErrorHandler.visable = false;
  }

  componentWillUnmount(){}

  render() {

    var store = this.props.store;
    var classname = 'tap-card-container';
    if(store.uIStore.getIsActive === 'CARD' && store.paymentStore.selected_card === this.props.id && !this.props.shake){
      classname  = 'tap-card-container tap-card-active';
    }
    else if(this.state.shake){
      classname  = 'tap-card-shake';
    }
    else if(this.state.delete){
      classname  = 'tap-card-disabled';
    }

    return (
      <div className={'tap-card ' + this.state.delete_card}>

        {this.state.loading ?
        <div className="tap-progressbar-container" style={{opacity: this.state.fade ? 0 : 1}}>
          <CircularProgressBar style={{opacity: this.state.fade ? 0 : 1}} sqSize="50" strokeWidth="2" percentage={this.state.percentage}/>
        </div> :  null}

        <div
          className={classname}
          id={this.props.id}
          dataindex={this.props.index}
          ref={(node) => this.cardRef = node}
          dir={this.props.dir}
          style={this.props.style ? Object.assign({}, this.state.styles, this.props.style) : this.state.styles}
          onClick={this.handleCustomerCards.bind(this)}>
            {this.state.shake ?
              <div className="tap-remove-card" onClick={this.deleteCard.bind(this)}>
                  <img src={deleteIcon} width="18" height="18" alt="Delete the saved card"/>
              </div>
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
