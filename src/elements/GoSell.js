import React, { Component } from "react";
import { observer } from "mobx-react";
import Paths from "../../webpack/paths";
import RootStore from "../store/RootStore.js";
import TapLoader from "./TapLoader";
import "../assets/css/style.css";

class GoSell extends Component {
  //open Tap gateway as a light box by JS library
  static openLightBox() {
    RootStore.uIStore.setMode("popup");
    RootStore.uIStore.setOpenModal(true);
    RootStore.uIStore.setLoader(true);

    var body = document.getElementsByTagName("BODY")[0];
    body.classList.add("gosell-payment-gateway-open");

    setTimeout(function() {
      var iframe = document.getElementById("gosell-gateway");

      iframe.addEventListener("load", function() {
        setTimeout(function() {
          RootStore.uIStore.setLoader(false);
        }, 500);
      });
    }, 100);
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage() {
    RootStore.uIStore.setMode("page");
    RootStore.uIStore.setOpenModal(true);
    RootStore.uIStore.setLoader(true);

    if (RootStore.configStore.token != null) {
      window.open(
        Paths.framePath +
          "?mode=" +
          RootStore.uIStore.modalMode +
          "&token=" +
          RootStore.configStore.token,
        "_self",
      );
    }
  }

  static showResult(props) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("tap_id") && urlParams.has("token")) {
      let callback = null;

      if (props.gateway && props.gateway.callback) {
        callback = props.gateway.callback;
      } else if (props.callback) {
        callback = props.callback;
      }

      RootStore.configStore.callback = callback;

      RootStore.uIStore.setMode("popup");
      RootStore.uIStore.setOpenModal(true);
      RootStore.uIStore.setLoader(true);

      var body = document.getElementsByTagName("BODY")[0];
      body.classList.add("gosell-payment-gateway-open");

      RootStore.uIStore.tap_id = urlParams.get("tap_id");
      RootStore.configStore.token = urlParams.get("token");
      RootStore.uIStore.modalMode = urlParams.get("mode");

      setTimeout(function() {
        var iframe = document.getElementById("gosell-gateway");

        iframe.addEventListener("load", function() {
          // console.log("hey loaded!");
          setTimeout(function() {
            RootStore.uIStore.setLoader(false);
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
      config: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("new props: ", JSON.stringify(nextProps));
    // console.log("old props: ", JSON.stringify(prevState.config));
    // console.log(
    //   "compare props: ",
    //   JSON.stringify(nextProps) != JSON.stringify(prevState.config),
    // );

    if (JSON.stringify(nextProps) != JSON.stringify(prevState.config)) {
      GoSell.config(nextProps);
      prevState.config = nextProps;
    }

    return null;
  }

  static config(props) {
    var URLSearchParams = require("@ungap/url-search-params/cjs");
    var urlParams = new URLSearchParams(window.location.search);

    if (!urlParams.has("tap_id")) {
      RootStore.configStore.setConfig(props, "GOSELL");
    }
  }

  componentDidMount() {
    GoSell.showResult(this.props);

    setTimeout(function() {
      var iframe = document.getElementById("gosell-gateway");

      iframe &&
        iframe.addEventListener("load", function() {
          setTimeout(function() {
            RootStore.uIStore.setLoader(false);
          }, 500);
        });
    }, 100);

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
        // console.log("event", e.data);

        if (e.data.callback) {
          if (
            self.props &&
            self.props.callback &&
            self.props.callback != null
          ) {
            self.props.callback(e.data);
          } else {
            RootStore.configStore.callbackFunc(e.data);
          }
        }

        if (e.data == "close" || e.data.close) {
          console.log("close it");

          RootStore.uIStore.setOpenModal(false);
          self.setState({ config: {} });
          self.props = {};

          RootStore.configStore.gateway.onClose
            ? RootStore.configStore.gateway.onClose()
            : null;
          e.data == "close"
            ? self.closeModal(RootStore.configStore.redirect_url)
            : self.closeModal(e.data.close);
        }
      },
      false,
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

    // var iframe = document.getElementById("gosell-gateway");
    // iframe.setAttribute("src", iframe.getAttribute("src"));

    RootStore.uIStore.setOpenModal(false);
    RootStore.uIStore.setLoader(true);
  }

  componentWillUnMount() {
    // Create IE + others compatible event handler
    this.callbacks();
  }

  render() {
    return (
      <React.Fragment>
        {RootStore.uIStore.modalMode == "popup" &&
        RootStore.uIStore.openModal ? (
          <iframe
            id="gosell-gateway"
            style={{
              display: !RootStore.uIStore.isLoading ? "block" : "none",
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
