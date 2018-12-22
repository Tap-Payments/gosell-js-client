// import 'babel-polyfill';
import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import GoSell from './elements/GoSell.js';
import GoSellForm from './elements/GoSellForm.js';

module.exports = {
  GoSell:GoSell,
  GoSellForm:GoSellForm,
  config:function(object) {

    ReactDOM.render(
    <GoSell
      gateway={object.gateway}
      customer={object.customer}
      order={object.order}
      charge={object.charge}
      authorize={object.authorize}
      saveCard={object.saveCard}
      token={object.token}/>, document.getElementById(object.containerID));

  },
  openLightBox:function(){
    module.exports.GoSell.open();
  },
  openPaymentPage:function(){
    //this option only for charge & authorize cases
    //I should call charge or Authorize API
    window.open('http://', '_self')
  },
  generateCardElements:function(object){
    ReactDOM.render(
    <GoSellForm
      gateway={object.gateway}
      customer={object.customer}
      order={object.order}
      saveCard={object.saveCard}
      token={object.token}/>, document.getElementById(object.containerID));
  }
};
