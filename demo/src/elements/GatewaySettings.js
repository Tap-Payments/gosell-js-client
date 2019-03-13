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
      <div className="gateway-settings">
      <fieldset>
          <legend>Gateway Settings:</legend>
          <div className='app-container'>
              <label>Public Key: </label>
              <div className='app-row'>
                <input
                  type="text"
                  name="publicKey"
                  placeholder="Public key"
                  style={{width: '100%'}}
                  value={this.Store.gateway.publicKey}
                  //disabled={true}
                  onChange={(value) => this.Store.updateGatewayObj(value)}
                  />
              </div>
              <p style={{fontSize: '12px', color: 'gray', margin: '0px'}}>pls, don't change public key if you're going to test redirect payments like KNET since the page should call get charge API with the same public key after the redirection.</p>
            </div>
            <br />

            <div className='app-container'>
              Language:
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={this.Store.gateway.language === 'en'}
                    onChange={(value) => this.Store.updateGatewayObj(value)}/>
                  En
                </label>

                <label>
                  <input
                    type="radio"
                    name="language"
                    value="ar"
                    checked={this.Store.gateway.language === 'ar'}
                    onChange={(value) => this.Store.updateGatewayObj(value)}/>
                  Ar
                </label>
              </div>
            </div>
            <br />

            <div>
              Contact Info:
              <input
                type="checkbox"
                name="contactInfo"
                checked={this.Store.gateway.contactInfo == true}
                onChange={(value) => this.Store.updateGatewayObj(value)}/>
            </div>
            <br />

            <div className='app-container'>
              <label>Supported Currencies: </label>
              <div className='app-row'>
                <input
                  type="text"
                  style={{width: '100%'}}
                  name="supportedCurrencies"
                  placeholder="KWD,SAR"
                  value={this.Store.gateway.supportedCurrencies}
                  onChange={(value) => this.Store.updateGatewayObj(value)}/>
              </div>

              <p style={{fontSize: '12px', color: 'gray', margin: '0px'}}>Add coma between the currencies list</p>
            </div>
            <br />

            <div className='app-container'>
              <label>Supported Payment Methods: </label>
              <div className='app-row'>
                <input
                  type="text"
                  style={{width: '100%'}}
                  name="supportedPaymentMethods"
                  placeholder="all | KNET,VISA,MASTERCARD,MADA"
                  value={this.Store.gateway.supportedPaymentMethods}
                  onChange={(value) => this.Store.updateGatewayObj(value)}/>
              </div>
              <p style={{fontSize: '12px', color: 'gray', margin: '0px'}}>Add coma between the payment methods list</p>

            </div>
            <br />

            <div>
              Save Card Option:
              <input
                type="checkbox"
                name="saveCardOption"
                checked={this.Store.gateway.saveCardOption == true}
                onChange={(value) => this.Store.updateGatewayObj(value)}/>
            </div>
            <br />

            <div>
              Customer Cards:
              <input
                type="checkbox"
                name="customerCards"
                checked={this.Store.gateway.customerCards == true}
                onChange={(value) => this.Store.updateGatewayObj(value)}/>
            </div>
            <br />
            <div className='app-container'>
              <label>Notifications: </label>
              <div>
                <input
                  type="text"
                  style={{width: '100%'}}
                  name="notifications"
                  placeholder="standard"
                  value={this.Store.gateway.notifications}
                  onChange={(value) => this.Store.updateGatewayObj(value)}/>
              </div>
            </div>
            <br />

            <div className='app-container'>
              <label>Action Button Title: </label>
              <div>
              <input
                type="text"
                style={{width: '100%'}}
                name="labels"
                placeholder="Pay"
                value={this.Store.gateway.labels.actionButton}
                onChange={(value) => this.Store.updateGatewayObj(value)}/>

              </div>
            </div>
            <br />
      </fieldset>

      </div>
    );
  }
}

// <textarea
//   type="text"
//   style={{width: '100%'}}
//   name="labels"
//   rows={4}
//   defaultValue={JSON.stringify(Store.gateway.labels)}
//   placeholder={JSON.stringify(Store.gateway.labels)}
//   onChange={(value) => Store.updateGatewayObj(value)} />
export default observer(GatewaySettings);
