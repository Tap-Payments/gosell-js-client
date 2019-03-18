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

    total = total > 0 ? store.uIStore.formatNumber(total.toFixed(current.decimal_digit)) : total;
    let symbol = store.localizationStore.getContent('supported_currencies_symbol_' + current.currency.toLowerCase(), null);

    let total_fees = store.uIStore.dir === 'rtl' ? (fees + symbol) : (symbol + fees);
    let total_amount = store.uIStore.dir === 'rtl' ? (total + symbol) : (symbol+ total);

    return (
        <Confirm index={1} store={store}>
            <div dir={this.props.dir} className="gosell-gateway-extra-fees-container">
              <p className="gosell-gateway-extra-fees-title">{store.localizationStore.getContent('alert_extra_charges_title', null)}</p>
              <p className="gosell-gateway-extra-fees-msg">{store.localizationStore.getContent('alert_extra_charges_message', null).replace('%@', total_fees).replace('%@', total_amount)}</p>
            </div>
        </Confirm>
      );
  }
}

export default observer(ExtraFees);
