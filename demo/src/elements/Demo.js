import React, { Component }  from "react";
import Store from '../../store/DemoConfigStore';
import {observer} from 'mobx-react';
import './app.css';
import TapBtn from './TapBtn';
import { GoSell } from "../../../src";
import { GoSellElements } from "../../../src";

class Demo extends Component {

  constructor(props){
    super(props);

    this.state = {
      showElements: false
    }
  }

  handleLightBox(){
    this.setState({
      showElements: false
    });

    setTimeout(function(){
      GoSell.openLightBox();
    }, 500);

  }

  handleElements(){
    this.setState({
      showElements: !this.state.showElements
    });
  }

  handleGoSellElements(){
    Store.btnLoading = true;

    GoSellElements.submit().then(result => {
      Store.btnLoading = false;
    });
  }

  render() {
    return (
      <div className="demo-settings">
      <fieldset>
          <legend>goSell LightBox Demo:</legend>

            <div className='app-container'>
              <label>Transaction Mode: </label>
              <div className='app-row'>
                <select
                   name="transaction_mode"
                   value={Store.transaction_mode}
                   style={{ width: '100%', fontSize: '14px' }}
                   onChange={(value) => Store.updateMode(value)}>
                   <option value="charge">Charge Mode</option>
                   <option value="authorize">Authorize Mode</option>
                   <option value="save_card">Save Card Mode</option>
                   <option value="get_token">Tokenize Mode</option>
                 </select>
              </div>
            </div>
            <br />

            {Store.transaction_mode == 'authorize' ?
                <div className='app-container'>
                  Auto:
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="VOID"
                        checked={Store.authorize.type === 'VOID'}
                        onChange={(value) => Store.updateAuthorize(value)}/>
                      VOID
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="CAPTURE"
                        checked={Store.authorize.type === 'CAPTURE'}
                        onChange={(value) => Store.updateAuthorize(value)}/>
                      CAPTURE
                    </label>
                  </div>
                </div>
            : <div></div>}

             <GoSell
                gateway={Store.gateway}
                customer={Store.customer}
                order={Store.order}
                charge={Store.transaction_mode === 'charge' ? Store.transaction : null}
                authorize={Store.transaction_mode === 'authorize' ? Store.transaction : null}
                saveCard={Store.transaction_mode === 'save_card'}
                token={Store.transaction_mode === 'get_token'}/>

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
              active={Store.transaction_mode === 'get_token'}
              animate={false}
              handleClick={this.handleElements.bind(this)}>goSell Elements</TapBtn>


            { this.state.showElements ?
              <React.Fragment>
                <GoSellElements gateway={Store.gateway} token={true}/>

                <p id="msg-area" style={{color: 'gray'}}>if you want custom notifications add 'msg-area' instead of 'standard'</p>

                <TapBtn
                   id="gosell-elements-pay-btn"
                   width="90%"
                   height="44px"
                   btnColor={'#2ACE00'}
                   active={true}
                   animate={Store.btnLoading}
                   handleClick={this.handleGoSellElements.bind(this)}>{Store.gateway.labels.actionButton != null ? Store.gateway.labels.actionButton : "Pay"}</TapBtn>
              </React.Fragment>
             : null}

      </fieldset>

      </div>
    );
  }
}


export default observer(Demo);
