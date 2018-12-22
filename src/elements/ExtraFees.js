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
    var store = this.props.store;

    if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
        store.uIStore.startLoading('loader', 'Please Wait', null);
    }

    store.apiStore.handleTransaction(store.paymentStore.source_id,
      store.paymentStore.active_payment_option.payment_type,
      store.paymentStore.active_payment_option_fees).then(result =>{

          if(store.uIStore.getIsActive != null && store.uIStore.getIsActive.toUpperCase() !== 'CARD'){
            // setTimeout(function(){
            //     self.props.store.uIStore.setOpenModal(false);
            //     self.props.store.uIStore.load = false;
            //     self.props.store.uIStore.isLoading = false;
                self.props.store.uIStore.stopBtnLoader();
             // }, 5000);
          }
        });
  }

  render() {
    let current = this.props.store.paymentStore.current_currency;
    let fees = this.props.store.paymentStore.active_payment_option_fees;
    let total = this.props.store.paymentStore.active_payment_option_total_amount;

    return (
        <Confirm index={0} store={this.props.store} animate_btn={false} active_btn={this.state.active} handleBtnClick={this.handleExtraFeesClick.bind(this)}>
            <div dir={this.props.dir} className="tap-extra-fees-container">
              <p className="tap-extra-fees-title">Confirm Extra Charges</p>
              <p className="tap-extra-fees-msg">You will be charged an additional fee of {current.symbol + fees} for the type of payment, totalling an amount of {current.symbol+ total}.</p>
            </div>
        </Confirm>
      );
  }
}

export default observer(ExtraFees);
