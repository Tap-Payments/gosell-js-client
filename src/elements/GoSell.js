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
    RootStore.uIStore.setOpenModal(true);
    RootStore.uIStore.isLoading = true;

    if (RootStore.configStore.token != null) {
      // RootStore.uIStore.isLoading = false;
      window.open(
        Paths.framePath +
          "?mode=" +
          RootStore.uIStore.modalMode +
          "&token=" +
          RootStore.configStore.token,
        "_self"
      );
    }
  }

  static showResult() {
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
      tap_id: null,
    };

    GoSell.config(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps != prevState) GoSell.config(nextProps);

    return nextProps;
  }

  static config(props) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");
    var urlParams = new URLSearchParams(window.location.search);

    // console.log("props", props);
    if (
      // Object.keys(props).length > 1 &&
      JSON.stringify(props) != RootStore.configStore.oldConfig &&
      !urlParams.has("tap_id")
    ) {
      RootStore.configStore.setConfig(props, "GOSELL");
    }
  }

  componentDidMount() {
    GoSell.showResult();

    if (
      document.getElementById("gosell-gateway") != null &&
      RootStore.uIStore.modalMode == "popup"
    ) {
      var iframe = document.getElementById("gosell-gateway");

      iframe.addEventListener("load", function() {
        console.log("hey loaded!");
        setTimeout(function() {
          RootStore.uIStore.isLoading = false;
        }, 500);
      });
    }

    this.callbacks();
  }

  callbacks() {
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
        console.log("event", e.data);

        if (e.data.callback) {
          if (
            self.props &&
            self.props.callback &&
            self.props.callback != null
          ) {
            self.props.callback(e.data);
            // console.log("inside event ", self.props);
          } else {
            RootStore.configStore.callbackFunc(e.data);
          }
        }
        console.log(
          "CLOSE",
          e.data.close == RootStore.configStore.redirect_url
        );
        console.log("CLOSE", RootStore.configStore.redirect_url);

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
      },
      false
    );
  }

  closeModal(closeUrl) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id")) {
      window.open(closeUrl, "_self");
    }
    var body = document.getElementsByTagName("BODY")[0];
    body.classList.remove("gosell-payment-gateway-open");

    var iframe = document.getElementById("gosell-gateway");

    iframe.setAttribute("src", iframe.getAttribute("src"));
    RootStore.uIStore.setOpenModal(false);
    RootStore.uIStore.isLoading = true;
  }

  componentWillUnMount() {
    // Create IE + others compatible event handler
    this.callbacks();
  }

  render() {
    return (
      <React.Fragment>
        {RootStore.uIStore.modalMode == "popup" ? (
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
              zIndex: "99999999999999999",
            }}
            src={
              RootStore.uIStore.tap_id != null &&
              RootStore.configStore.token != null
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
        ) : null}

        {RootStore.uIStore.openModal ? (
          <TapLoader
            type="loader"
            color={"white"}
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
