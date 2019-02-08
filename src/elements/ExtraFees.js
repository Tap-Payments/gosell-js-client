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

  render() {

    let store = this.props.store;
    let current = store.paymentStore.current_currency;

    let fees = store.paymentStore.active_payment_option_fees;
    fees = store.uIStore.formatNumber(fees.toFixed(current.decimal_digit));

    let total = store.paymentStore.active_payment_option_total_amount;
    console.log("total ******** ", total);
    total = store.uIStore.formatNumber(total.toFixed(current.decimal_digit));

    return (
        <Confirm index={1} store={store}>
            <div dir={this.props.dir} className="tap-extra-fees-container">
              <p className="tap-extra-fees-title">Confirm Extra Charges</p>
              <p className="tap-extra-fees-msg">You will be charged an additional fee of {current.symbol + fees} for the type of payment, totalling an amount of {current.symbol+ total}.</p>
            </div>
        </Confirm>
      );
  }
}

export default observer(ExtraFees);
