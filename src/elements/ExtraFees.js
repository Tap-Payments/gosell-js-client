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
    total = total > 0 ? store.uIStore.formatNumber(total.toFixed(current.decimal_digit)) : total;
    let symbol = store.localizationStore.getContent('supported_currencies_symbol_' + current.currency.toLowerCase(), null);

    return (
        <Confirm index={1} store={store}>
            <div dir={this.props.dir} className="tap-extra-fees-container">
              <p className="tap-extra-fees-title">{store.localizationStore.getContent('alert_extra_charges_title', null)}</p>
              <p className="tap-extra-fees-msg">{store.localizationStore.getContent('alert_extra_charges_message', null).replace('%@', symbol + fees).replace('%@', symbol+ total)}</p>
            </div>
        </Confirm>
      );
  }
}

export default observer(ExtraFees);
