import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import TapButton from './TapButton';
import Confirm from './Confirm';
import '../assets/css/fees.css';

class ExtraFees extends Component {

  constructor(props){
    super(props);
    this.state = {
      active: true
    }
  }

  handleExtraFeesClick(){
    var self = this;

    if(this.props.payment.payment_type.toUpperCase() !== 'CARD'){
        this.props.store.uIStore.startLoading('loader', 'Please Wait', null);
    }
    
    this.props.store.apiStore.charge(this.props.source, this.props.payment.payment_type.toUpperCase(), this.props.payment.extra_fees[0].value).then(result =>{
          console.log('extra fees', this.props.payment.payment_type.toUpperCase());
          if(this.props.payment.payment_type.toUpperCase() !== 'CARD'){
            setTimeout(function(){
                self.props.store.uIStore.setOpenModal(false);
                self.props.store.uIStore.load = false;
                self.props.store.uIStore.isLoading = false;
                self.props.store.uIStore.stopBtnLoader();
             }, 5000);
          }

        });
    // }

  }

  render() {
    console.log('active payment options', this.props.payment);
    let current =  this.props.store.paymentStore.current_currency;
    let fees = this.props.payment && this.props.payment.extra_fees ? this.props.payment.extra_fees[0].value : 0.0;
    let total_amount = current.amount + fees;

    return (
        <Confirm index={0} store={this.props.store} animate_btn={false} active_btn={this.state.active} handleBtnClick={this.handleExtraFeesClick.bind(this)}>
            <div dir={this.props.dir} className="tap-extra-fees-container">
              <p className="tap-extra-fees-title">Confirm Extra Charges</p>
              <p className="tap-extra-fees-msg">You will be charged an additional fee of {current.symbol + fees} for the type of payment, totalling an amount of {current.symbol+ total_amount}.</p>
            </div>
        </Confirm>
      );
  }
}

export default observer(ExtraFees);
