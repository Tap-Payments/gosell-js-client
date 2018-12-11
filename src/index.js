// import 'babel-polyfill';
import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import GoSell from './elements/GoSell.js';

module.exports = {
  GoSell:GoSell,
  config:function (object) {
    ReactDOM.render(<TapGateway open={false} pk={object.gateway.publicKey} data={{
      "amount":object.amount,
      "currency":object.currency,
      "customer":object.customer,
      "redirectURL":object.redirectURL ? object.redirectURL : window.location.href,
      "description": object.others.description ? object.others.description : null,
      "statement_descriptor": object.others.statement_descriptor ? object.others.statement_descriptor : null,
      "reference": object.others.reference ? object.others.reference : {
        "transaction": null,
        "order": null
      },
      "metadata":object.others.metadata ? object.others.metadata : {},
      "receipt": object.others.receipt ? object.others.receipt :{
        "email": false,
        "sms": true
      }
    }} notifications={object.notificationsID ? object.notificationsID : 'standard'}/>, document.getElementById(object.containerID));

  },
  openLightBox:function(){
    module.exports.GoSell.open();
  },
  openPaymentPage:function(){
    module.exports.GoSell.open();
  }
};
