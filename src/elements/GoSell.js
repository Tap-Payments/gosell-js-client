import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Paths from '../../webpack/paths';
import RootStore from '../store/RootStore.js';

class GoSell extends Component {

  //open Tap gateway as a light box by JS library
  static openLightBox(){
    RootStore.uIStore.modalMode = 'popup';
    RootStore.uIStore.setOpenModal(true);
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage(){
    window.open(Paths.pagePath + "?token="+RootStore.configStore.token, '_self')
  }

  static showTranxResult(){
    var URLSearchParams = require('url-search-params');
    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){

      RootStore.uIStore.setOpenModal(true);
      RootStore.uIStore.tap_id = urlParams.get('tap_id');

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

  componentWillMount() {
    this.config(this.props);
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

      if(e.data != 'close'){
        RootStore.configStore.callbackFunc(e.data);
      }

    }, false);

  }

  closeModal(){
    var URLSearchParams = require('url-search-params');

    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      var url = document.location.href;
      var url = url.split('?');

      window.open(url[0], '_self');
    }
  }

  componentWillUnMount(){
    // Create IE + others compatible event handler
    var eventMethod = window.removeEventListener ? "removeEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
      if(e.data == 'close'){
        //console.log('close it');
        RootStore.uIStore.setOpenModal(false);
      }
      //console.log('parent received message!:  ',e.data);
    },false);
  }

  render() {

    return(
        <React.Fragment>
              {RootStore.uIStore.openModal ?
                <iframe
                style={{
                    display: 'block',
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
                  Paths.popupPath +"?token="+RootStore.configStore.token+"&tap_id="+ RootStore.uIStore.tap_id
                  : Paths.popupPath + "?token="+RootStore.configStore.token
                } width="100%" height="100%"></iframe>
              : null}

        </React.Fragment>
      );

  }
}

export default observer(GoSell);
