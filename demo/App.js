import React, { Component } from "react";
import { ApplePay } from "../src";

class Popup extends Component {
  componentWillMount() {}

  render() {
    return (
      <div>
        Apple Pay Button: <ApplePay />
      </div>
    );
  }
}

export default Popup;
