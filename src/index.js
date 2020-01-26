import "@babel/polyfill/noConflict";
import React from "react";
import ReactDOM from "react-dom";
import GoSell from "./elements/GoSell.js";
import GoSellElements from "./elements/GoSellElements.js";

module.exports = {
  GoSell: GoSell,
  GoSellElements: GoSellElements,
  config: function(object) {
    if (object.containerID) {
      ReactDOM.render(
        <GoSell
          gateway={object.gateway}
          customer={object.customer}
          order={object.order}
          transaction={{
            mode: object.transaction.mode,
            charge: object.transaction.charge,
            authorize: object.transaction.authorize
          }}
        />,
        document.getElementById(object.containerID)
      );
    } else {
      var container = document.createElement("div");
      container.setAttribute("id", "gosell-js-lib");

      document.body.insertBefore(container, document.body.childNodes[0]);

      ReactDOM.render(
        <GoSell
          gateway={object.gateway}
          customer={object.customer}
          order={object.order}
          transaction={{
            mode: object.transaction.mode,
            charge: object.transaction.charge,
            authorize: object.transaction.authorize
          }}
        />,
        document.getElementById("gosell-js-lib")
      );
    }
  },
  openLightBox: function() {
    module.exports.GoSell.openLightBox();
  },
  openPaymentPage: function() {
    //this option only for charge & authorize cases
    //The function calls create charge or Authorize API
    module.exports.GoSell.openPaymentPage();
  },
  goSellElements: function(object) {
    ReactDOM.render(
      <GoSellElements
        gateway={object.gateway}
        transaction={{ mode: "token" }}
      />,
      document.getElementById(object.containerID)
    );
  },
  submit: function() {
    module.exports.GoSellElements.submit();
  }
};
