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
    // RootStore.uIStore.isLoading = true;

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.add('gosell-payment-gateway-open');

    console.log(RootStore.configStore.token);

    var iframe = document.getElementById('gosell-gateway');

    iframe.addEventListener('load', function(){
        console.log('hey reloaded!');
        setTimeout(function(){
          RootStore.uIStore.isLoading = false;
        }, 100);
    });
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage(){
    RootStore.uIStore.modalMode = 'page';
    window.open(Paths.framePath + "?mode="+RootStore.uIStore.modalMode+"&token="+RootStore.configStore.token, '_self')
  }

  static showTranxResult(){
    var URLSearchParams = require('url-search-params');
    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      // RootStore.uIStore.isLoading = true;
      RootStore.uIStore.setOpenModal(true);

      var body = document.getElementsByTagName("BODY")[0];
      body.classList.add('gosell-payment-gateway-open');

      RootStore.uIStore.tap_id = urlParams.get('tap_id');
      RootStore.configStore.token = urlParams.get('token');
      RootStore.uIStore.modalMode = urlParams.get('mode');
      console.log('mooooode', RootStore.uIStore.modalMode);

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

    var iframe = document.getElementById('gosell-gateway');

    iframe.addEventListener('load', function(){
        console.log('hey loaded!');
        setTimeout(function(){
          RootStore.uIStore.isLoading = false;
        }, 100);
    });

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
        RootStore.configStore.onCloseFunc();
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
      window.open(RootStore.configStore.redirect_url, '_self');
    }

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove('gosell-payment-gateway-open');

    //reload the iframe again after closing
    var iframe = document.getElementById('gosell-gateway');

    iframe.setAttribute('src', iframe.getAttribute('src'));

    RootStore.uIStore.isLoading = true;
  }

  // componentWillUnMount(){
  //   // Create IE + others compatible event handler
  //   var eventMethod = window.removeEventListener ? "removeEventListener" : "attachEvent";
  //   var eventer = window[eventMethod];
  //   var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  //   // Listen to message from child window
  //   eventer(messageEvent,function(e) {
  //     if(e.data == 'close'){
  //       console.log('close');
  //       RootStore.uIStore.setOpenModal(false);
  //       var body = document.getElementsByTagName("BODY")[0];
  //       body.classList.remove('gosell-payment-gateway-open');
  //     }

  //   },false);
  // }

  render() {
    console.log('client open modal', RootStore.uIStore.openModal);
    console.log('client is loading? ', RootStore.uIStore.isLoading);

    return(
        <React.Fragment>
              {/* {!RootStore.uIStore.isLoading ? */}
                <React.Fragment>
                  <iframe
                    id="gosell-gateway"
                    style={{
                        display: RootStore.uIStore.openModal && !RootStore.uIStore.isLoading ? 'block' : 'none',
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
                      Paths.framePath +"?mode="+RootStore.uIStore.modalMode+"&token="+RootStore.configStore.token+"&tap_id="+ RootStore.uIStore.tap_id
                      : Paths.framePath + "?mode="+RootStore.uIStore.modalMode+"&token="+RootStore.configStore.token
                    } width="100%" height="100%"></iframe>
                    
                  {RootStore.uIStore.openModal ?
                    <TapLoader
                      type='loader'
                      color={RootStore.uIStore.modalMode === 'popup' ? 'white' : 'black'}
                      store={RootStore}
                      status={RootStore.uIStore.isLoading}
                      duration={5}
                      title={null}
                      desc={null}
                    />
                    : null}
                  </React.Fragment>
               {/* : null} */}
        </React.Fragment>
      );

  }
}

export default observer(GoSell);
