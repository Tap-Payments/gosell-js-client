import React, { Component } from "react";
import { observer } from "mobx-react";
import Paths from "../../webpack/paths";
import RootStore from "../store/RootStore.js";
import TapLoader from "./TapLoader";
import "../assets/css/style.css";

class GoSell extends Component {
  //open Tap gateway as a light box by JS library
  static openLightBox() {
    RootStore.uIStore.modalMode = "popup";
    RootStore.uIStore.setOpenModal(true);

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.add("gosell-payment-gateway-open");
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage() {
    RootStore.uIStore.modalMode = "page";

    window.open(
      Paths.framePath + "?mode=page" + "&token=" + RootStore.configStore.token,
      "_self"
    );
  }

  static showTranxResult() {
    var URLSearchParams = require("@ungap/url-search-params/cjs");
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id") && urlParams.has("token")) {
      RootStore.uIStore.isLoading = true;
      RootStore.uIStore.setOpenModal(true);

      var body = document.getElementsByTagName("BODY")[0];
      body.classList.add("gosell-payment-gateway-open");

      RootStore.uIStore.tap_id = urlParams.get("tap_id");
      RootStore.configStore.token = urlParams.get("token");
      RootStore.uIStore.modalMode = urlParams.get("mode");

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

  componentWillMount() {
    this.config(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.config(nextProps);
  }

  config(props) {
    RootStore.configStore.setConfig(props);
  }

  componentDidMount() {
    GoSell.showTranxResult();

    var iframe = document.getElementById("gosell-gateway");

    iframe.addEventListener("load", function() {
      console.log("hey loaded!");
      setTimeout(function() {
        RootStore.uIStore.isLoading = false;
      }, 500);
    });

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
        if (e.data == "close") {
          //console.log('close it');
          RootStore.uIStore.setOpenModal(false);
          console.log("close 1", RootStore.configStore.gateway.onClose);
          console.log(
            "close 2",
            RootStore.configStore.gateway.onClose
              ? RootStore.configStore.gateway.onClose
              : null
          );
          RootStore.configStore.gateway.onClose
            ? RootStore.configStore.gateway.onClose()
            : null;
          self.closeModal();
        }

        if (e.data.callback && typeof e.data.callback == "object") {
          RootStore.configStore.callbackFunc(e.data);
        }
      },
      false
    );
  }

  closeModal() {
    var URLSearchParams = require("@ungap/url-search-params/cjs");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id")) {
      window.open(RootStore.configStore.redirect_url, "_self");
    }

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove("gosell-payment-gateway-open");
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
        if (e.data == "close") {
          console.log("close");
          RootStore.uIStore.setOpenModal(false);
          console.log("close 3", RootStore.configStore.gateway.onClose);
          console.log(
            "close 4",
            RootStore.configStore.gateway.onClose
              ? RootStore.configStore.gateway.onClose
              : null
          );
          RootStore.configStore.gateway.onClose
            ? RootStore.configStore.gateway.onClose()
            : null;

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
