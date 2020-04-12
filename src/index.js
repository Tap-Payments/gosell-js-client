import "@babel/polyfill/noConflict";
import React from "react";
import ReactDOM from "react-dom";
import GoSell from "./elements/GoSell.js";
import GoSellElements from "./elements/GoSellElements.js";

module.exports = {
  GoSell: GoSell,
  GoSellElements: GoSellElements,
  config: function(object) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id")) {
      if (
        object.containerID &&
        document.getElementById("gosell-gateway") == null
      ) {
        ReactDOM.render(
          <GoSell callback={object.gateway && object.gateway.callback} />,
          document.getElementById(object.containerID)
        );
      } else if (
        object.containerID == null &&
        document.getElementById("gosell-gateway") == null
      ) {
        var container = document.createElement("div");
        container.setAttribute("id", "gosell-js-lib");

        document.body.insertBefore(container, document.body.childNodes[0]);

        ReactDOM.render(
          <GoSell callback={object.gateway && object.gateway.callback} />,
          document.getElementById("gosell-js-lib")
        );
      }
    } else if (object.transaction && object.transaction.mode) {
      if (
        object.containerID &&
        document.getElementById("gosell-gateway") == null
      ) {
        ReactDOM.render(
          <GoSell
            gateway={object.gateway ? object.gateway : null}
            customer={object.customer ? object.customer : null}
            order={object.order ? object.order : null}
            transaction={{
              mode: object.transaction ? object.transaction.mode : null,
              charge:
                object.transaction && object.transaction.charge
                  ? object.transaction.charge
                  : null,
              authorize:
                object.transaction && object.transaction.authorize
                  ? object.transaction.authorize
                  : null
            }}
          />,
          document.getElementById(object.containerID)
        );
      }
      if (
        object.containerID == null &&
        document.getElementById("gosell-gateway") == null
      ) {
        var container = document.createElement("div");
        container.setAttribute("id", "gosell-js-lib");

        document.body.insertBefore(container, document.body.childNodes[0]);

        ReactDOM.render(
          <GoSell
            gateway={object.gateway ? object.gateway : null}
            customer={object.customer ? object.customer : null}
            order={object.order ? object.order : null}
            transaction={{
              mode: object.transaction ? object.transaction.mode : null,
              charge:
                object.transaction && object.transaction.charge
                  ? object.transaction.charge
                  : null,
              authorize:
                object.transaction && object.transaction.authorize
                  ? object.transaction.authorize
                  : null
            }}
          />,
          document.getElementById("gosell-js-lib")
        );
      }
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
  showResult: function(object) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id")) {
      if (document.getElementById("gosell-gateway") == null) {
        var container = document.createElement("div");
        container.setAttribute("id", "gosell-js-lib");

        document.body.insertBefore(container, document.body.childNodes[0]);

        if (object && object.callback) {
          ReactDOM.render(
            <GoSell callback={object.callback} />,
            document.getElementById("gosell-js-lib")
          );
        } else {
          ReactDOM.render(<GoSell />, document.getElementById("gosell-js-lib"));
        }
      }
    }
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
