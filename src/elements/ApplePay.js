import React, { Component } from "react";
import { observer } from "mobx-react";
import "../assets/css/applePay.css";
import RootStore from "../store/RootStore";

class ApplePay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      RootStore: RootStore
    };
  }

  //   componentWillMount() {
  //     this.state.RootStore.applePayStore.config();
  //   }

  onClickHandler() {
    this.state.RootStore.applePayStore.requestPayment();
  }

  render() {
    return (
      <div
        id="apple-pay-btn"
        className="apple-pay-set-up-button apple-pay-set-up-button-white"
        onClick={this.onClickHandler.bind(this)}
      ></div>
    );
  }
}

export default observer(ApplePay);
