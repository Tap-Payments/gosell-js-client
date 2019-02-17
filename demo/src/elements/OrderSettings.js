import React, { Component }  from "react";
// import Store from '../../store/DemoConfigStore';
import {observer} from 'mobx-react';
import './app.css';

class GatewaySettings extends Component {

  constructor(props){
    super(props);
    this.Store = props.store

  }

  render() {
    return (
      <div className="order-settings">
      <fieldset>
          <legend>Order Settings:</legend>
          <div className='app-container'>
                 <label>Currency: </label>
                 <div className='app-row'>
                   <select
                      name="currency"
                      value={this.Store.order.currency}
                      onChange={(value) => this.Store.updateOrder(value)}>
                      <option value="KWD">KWD</option>
                      <option value="SAR">SAR</option>
                      <option value="BHD">BHD</option>
                      <option value="AED">AED</option>
                      <option value="EGP">EGP</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="OMR">OMR</option>
                      <option value="QAR">QAR</option>
                      <option value="USD">USD</option>

                    </select>
                 </div>
               </div>
               <br />

               <div className='app-container'>
                 <label>Total amount: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="amount"
                     value={this.Store.order.amount}
                     onChange={(value) => this.Store.updateOrder(value)}/>
                 </div>
               </div>
               <br />
      </fieldset>

      </div>
    );
  }
}

export default observer(GatewaySettings);
