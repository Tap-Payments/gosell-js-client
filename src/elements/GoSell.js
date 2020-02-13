import React, { Component } from "react";
import { observer } from "mobx-react";
import Paths from "../../webpack/paths";
import RootStore from "../store/RootStore.js";
import TapLoader from "./TapLoader";
import "../assets/css/style.css";
import ReactDOM from "react-dom";

class GoSell extends Component {
  //open Tap gateway as a light box by JS library
  static openLightBox() {
    RootStore.uIStore.modalMode = "popup";
    RootStore.uIStore.setOpenModal(true);
    // RootStore.uIStore.isLoading = true;

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.add("gosell-payment-gateway-open");
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage() {
    RootStore.uIStore.modalMode = "page";
    window.open(
      Paths.framePath +
        "?mode=" +
        RootStore.uIStore.modalMode +
        "&token=" +
        RootStore.configStore.token,
      "_self"
    );
  }

  static showTranxResult() {
    var URLSearchParams = require("url-search-params");
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id") && urlParams.has("token")) {
      if (document.getElementById("gosell-gateway") == null) {
        ReactDOM.render(<GoSell />, document.getElementById("gosell-js-lib"));
      }

      RootStore.uIStore.isLoading = true;
      RootStore.uIStore.setOpenModal(true);

      var body = document.getElementsByTagName("BODY")[0];
      body.classList.add("gosell-payment-gateway-open");

      RootStore.uIStore.tap_id = urlParams.get("tap_id");
      RootStore.configStore.token = urlParams.get("token");
      RootStore.uIStore.modalMode = urlParams.get("mode");
      console.log("mooooode", RootStore.uIStore.modalMode);

      console.log("url token", urlParams.get("token"));
      setTimeout(function() {
        var iframe = document.getElementById("gosell-gateway");

        iframe.addEventListener("load", function() {
          console.log("hey loaded!");
          setTimeout(function() {
            RootStore.uIStore.isLoading = false;
          }, 500);
        });
      }, 100);

      return true;
    } else {
      return false;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      tap_id: null
    };
  }

  componentWillMount() {
    this.config(this.props);
    // console.log('iframe', document.querySelector('iframe'));
  }

  componentWillReceiveProps(nextProps) {
    this.config(nextProps);
  }

  config(props) {
    var URLSearchParams = require("url-search-params");
    var urlParams = new URLSearchParams(window.location.search);

    // console.log("props", props);
    if (
      Object.keys(props).length > 0 &&
      RootStore.configStore.token == null &&
      !urlParams.has("tap_id")
    ) {
      RootStore.configStore.setConfig(props);
    }
  }

  componentDidMount() {
    GoSell.showTranxResult();

    if (document.getElementById("gosell-gateway") != null) {
      var iframe = document.getElementById("gosell-gateway");

      iframe.addEventListener("load", function() {
        console.log("hey loaded!");
        setTimeout(function() {
          RootStore.uIStore.isLoading = false;
        }, 500);
      });
    }

    var self = this;
    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(
      messageEvent,
      function(e) {
        if (e.data == "close" || e.data.close) {
          console.log("close it");
          RootStore.uIStore.setOpenModal(false);

          RootStore.configStore.gateway.onClose
            ? RootStore.configStore.gateway.onClose()
            : null;
          e.data == "close"
            ? self.closeModal(RootStore.configStore.redirect_url)
            : self.closeModal(e.data.close);
        }

        if (e.data.callback && typeof e.data.callback == "object") {
          RootStore.configStore.callbackFunc(e.data);
        }
      },
      false
    );
  }

  closeModal(closeUrl) {
    var URLSearchParams = require("url-search-params");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id")) {
      window.open(closeUrl, "_self");
    }
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove("gosell-payment-gateway-open");

    var iframe = document.getElementById("gosell-gateway");

    iframe.setAttribute("src", iframe.getAttribute("src"));

    RootStore.uIStore.isLoading = true;
  }

  componentWillUnMount() {
    // Create IE + others compatible event handler
    var eventMethod = window.removeEventListener
      ? "removeEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(
      messageEvent,
      function(e) {
        if (e.data == "close" || e.data.close) {
          RootStore.uIStore.setOpenModal(false);

          RootStore.configStore.gateway.onClose
            ? RootStore.configStore.gateway.onClose()
            : null;

          e.data == "close"
            ? self.closeModal(RootStore.configStore.redirect_url)
            : self.closeModal(e.data.close);

          var body = document.getElementsByTagName("BODY")[0];
          body.classList.remove("gosell-payment-gateway-open");
        }
      },
      false
    );
  }

  render() {
    return (
      <React.Fragment>
        <iframe
          id="gosell-gateway"
          style={{
            display:
              RootStore.uIStore.openModal && !RootStore.uIStore.isLoading
                ? "block"
                : "none",
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            margin: "auto",
            border: "0px",
            zIndex: "99999999999999999"
          }}
          src={
            RootStore.uIStore.tap_id != null
              ? Paths.framePath +
                "?mode=" +
                RootStore.uIStore.modalMode +
                "&token=" +
                RootStore.configStore.token +
                "&tap_id=" +
                RootStore.uIStore.tap_id
              : Paths.framePath +
                "?mode=" +
                RootStore.uIStore.modalMode +
                "&token=" +
                RootStore.configStore.token
          }
          width="100%"
          height="100%"
        ></iframe>

        {RootStore.uIStore.openModal ? (
          <TapLoader
            type="loader"
            color={RootStore.uIStore.modalMode === "popup" ? "white" : "black"}
            store={RootStore}
            status={RootStore.uIStore.isLoading}
            duration={5}
            title={null}
            desc={null}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default observer(GoSell);
