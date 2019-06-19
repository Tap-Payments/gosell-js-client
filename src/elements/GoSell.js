import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Paths from '../../webpack/paths';
import RootStore from '../store/RootStore.js';
import TapLoader from './TapLoader';
import '../assets/css/style.css';

class GoSell extends Component {

  //open Tap gateway as a light box by JS library
  static openLightBox(){

    RootStore.uIStore.modalMode = 'popup';
    RootStore.uIStore.setOpenModal(true);
    RootStore.uIStore.isLoading = true;

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.add('gosell-payment-gateway-open');

    console.log(RootStore.configStore.token);
    setTimeout(function(){
      var iframe = document.getElementById('gosell-gateway');

      iframe.addEventListener('load', function(){
        console.log('hey loaded!');
        setTimeout(function(){
          RootStore.uIStore.isLoading = false;
        }, 500);
      });

    }, 100);

  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage(){
    window.open(Paths.framePath + "?mode=page&token="+RootStore.configStore.token, '_self')
  }

  static showTranxResult(){
    var URLSearchParams = require('url-search-params');
    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      RootStore.uIStore.isLoading = true;
      RootStore.uIStore.setOpenModal(true);

      var body = document.getElementsByTagName("BODY")[0];
      body.classList.add('gosell-payment-gateway-open');

      RootStore.uIStore.tap_id = urlParams.get('tap_id');
      RootStore.configStore.token = urlParams.get('token');

      console.log('url token', urlParams.get('token'));
      setTimeout(function(){
        var iframe = document.getElementById('gosell-gateway');

        iframe.addEventListener('load', function(){
          console.log('hey loaded!');
          setTimeout(function(){
            RootStore.uIStore.isLoading = false;
          }, 500);
        });

      }, 100);

      return true;
    }
    else {
      return false;
    }
  }

  constructor(props){
    super(props);
    this.state = {
      tap_id:null
    }
  }

  componentWillMount(){
    this.config(this.props);
    // console.log('iframe', document.querySelector('iframe'));
  }

  componentWillReceiveProps(nextProps){
    this.config(nextProps);
  }

  config(props){
    RootStore.configStore.setConfig(props);
  }

  componentDidMount(){

    GoSell.showTranxResult();

    var self = this;
    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
      if(e.data == 'close'){
        //console.log('close it');
        RootStore.uIStore.setOpenModal(false);
        self.closeModal();
      }

      if(e.data.callback && typeof(e.data.callback) == 'object'){
        RootStore.configStore.callbackFunc(e.data);
      }

    }, false);

  }

  closeModal(){
    var URLSearchParams = require('url-search-params');

    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      // var url = document.location.href;
      // var url = url.split('?');
      // console.log('url', url[0]);

      window.open(RootStore.configStore.redirect_url, '_self');
    }

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove('gosell-payment-gateway-open');
  }

  componentWillUnMount(){
    // Create IE + others compatible event handler
    var eventMethod = window.removeEventListener ? "removeEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
      if(e.data == 'close'){
        console.log('close');
        RootStore.uIStore.setOpenModal(false);
        var body = document.getElementsByTagName("BODY")[0];
        body.classList.remove('gosell-payment-gateway-open');
      }

    },false);
  }

  render() {

    return(
        <React.Fragment>
              {RootStore.uIStore.openModal ?
                <React.Fragment>
                  <iframe
                    id="gosell-gateway"
                    style={{
                        display: !RootStore.uIStore.isLoading ? 'block' : 'none',
                        position: 'absolute',
                        top: '0',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        margin: 'auto',
                        border: '0px',
                        zIndex: '99999999999999999'
                      }}
                    src={RootStore.uIStore.tap_id != null ?
                      Paths.framePath +"?mode=popup&token="+RootStore.configStore.token+"&tap_id="+ RootStore.uIStore.tap_id
                      : Paths.framePath + "?mode=popup&token="+RootStore.configStore.token
                    } width="100%" height="100%"></iframe>

                    <TapLoader
                      type='loader'
                      status={RootStore.uIStore.isLoading}
                      duration={5}
                      title={null}
                      desc={null}
                    />

                  </React.Fragment>
              : null}
        </React.Fragment>
      );

  }
}

export default observer(GoSell);
