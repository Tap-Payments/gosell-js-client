import React, { Component }  from "react";
// import Store from '../../store/DemoConfigStore';
import {observer} from 'mobx-react';
import './app.css';
import TapBtn from './TapBtn';
import { GoSell } from "../../../src";
import { GoSellElements } from "../../../src";
import Cookies from "js-cookie";

class Demo extends Component {

  constructor(props){
    super(props);
    this.Store = props.store
    this.state = {
      showElements: false
    }
  }

  hey(data){
    //console.log(data);
  }

  setPublicKeyCookie(){
    if (this.Store.gateway.publicKey) {
      Cookies.set("goSellDemo_" + "publicKey", this.Store.gateway.publicKey);
    }
  }

  handleLightBox(){
    GoSell.openLightBox(this.hey);
    // set p-key on start
    this.setPublicKeyCookie()
    this.setState({
      showElements: false
    });

    setTimeout(function(){
      // GoSell.openLightBox();
    }, 500);

  }

  handleElements(){
    // set p-key on start
    this.setPublicKeyCookie()
    this.setState({
      showElements: !this.state.showElements
    });
  }

  handleGoSellElements(){

    this.Store.btnLoading = true;

    GoSellElements.submit().then(result => {
      this.Store.btnLoading = false;
    });
  }

  render() {

    // //console.log('something wrong here', this.Store.gateway);
    return (
      <div className="demo-settings">
      <fieldset>
          <legend>goSell LightBox Demo:</legend>

            <div className='app-container'>
              <label>Transaction Mode: </label>
              <div className='app-row'>
                <select
                   name="transaction_mode"
                   value={this.Store.transaction_mode}
                   style={{ width: '100%', fontSize: '14px' }}
                   onChange={(value) => this.Store.updateMode(value)}>
                   <option value="charge">Charge Mode</option>
                   <option value="authorize">Authorize Mode</option>
                   <option value="save_card">Save Card Mode</option>
                   <option value="token">Tokenize Mode</option>
                 </select>
              </div>
            </div>
            <br />

            {this.Store.transaction_mode == 'authorize' ?
                <div className='app-container'>
                  Auto:
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="VOID"
                        checked={this.Store.authorize.type === 'VOID'}
                        onChange={(value) => this.Store.updateAuthorize(value)}/>
                      VOID
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="CAPTURE"
                        checked={this.Store.authorize.type === 'CAPTURE'}
                        onChange={(value) => this.Store.updateAuthorize(value)}/>
                      CAPTURE
                    </label>
                  </div>
                </div>
            : <div></div>}

             <GoSell
                gateway={this.Store.gateway}
                customer={this.Store.customer}
                order={this.Store.order}
                transaction={{
                  mode: this.Store.transaction_mode,
                  charge: this.Store.transaction,
                  authorize: this.Store.transaction
                }} />

             <TapBtn
               id="gosell-lightbox-btn"
               width="90%"
               height="44px"
               btnColor={'#007AFF'}
               active={true}
               animate={false}
               handleClick={this.handleLightBox.bind(this)}>Open goSell LightBox</TapBtn>

            <TapBtn
              id="gosell-elements-btn"
              width="90%"
              height="44px"
              btnColor={'#007AFF'}
              active={this.Store.transaction_mode === 'token'}
              animate={false}
              handleClick={this.handleElements.bind(this)}>goSell Elements</TapBtn>


            { this.state.showElements ?
              <React.Fragment>
                <GoSellElements gateway={this.Store.gateway} token={true}/>

                <p id="msg-area" style={{color: 'gray'}}>if you want custom notifications add 'msg-area' instead of 'standard'</p>

                <TapBtn
                   id="gosell-elements-pay-btn"
                   width="90%"
                   height="44px"
                   btnColor={'#2ACE00'}
                   active={true}
                   animate={this.Store.btnLoading}
                   handleClick={this.handleGoSellElements.bind(this)}>{this.Store.gateway.labels.actionButton != null ? this.Store.gateway.labels.actionButton : "Pay"}</TapBtn>
              </React.Fragment>
             : null}

      </fieldset>

      </div>
    );
  }
}


export default observer(Demo);
