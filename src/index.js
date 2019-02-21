import "@babel/polyfill/noConflict";
import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import GoSell from './elements/GoSell.js';
import GoSellElements from './elements/GoSellElements.js';

module.exports = {
  GoSell:GoSell,
  GoSellElements:GoSellElements,
  config:function(object) {
    ReactDOM.render(
      <GoSell
        gateway={object.gateway}
        customer={object.customer}
        order={object.order}
        charge={object.charge}
        authorize={object.authorize}
        saveCard={object.saveCard}
        token={object.token} />, document.getElementById(object.containerID));
  },
  openLightBox:function(){
    module.exports.GoSell.openLightBox();
  },
  openPaymentPage:function(){
    //this option only for charge & authorize cases
    //The function calls create charge or Authorize API
    module.exports.GoSell.openPaymentPage();
  },
  goSellElements:function(object){
    ReactDOM.render(
      <GoSellElements
        gateway={object.gateway}
        token={true} />, document.getElementById(object.containerID));
  },
  submit:function(){
    module.exports.GoSellElements.submit();
  }
};
