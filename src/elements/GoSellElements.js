import React, { Component } from "react";
import { observer } from "mobx-react";
import RootStore from "../store/RootStore.js";

class GoSellElements extends Component {
  state = {};

  static async submit() {
    await RootStore.formStore.generateToken();
  }

  componentDidMount() {
    RootStore.apiStore.getLocalization().then((result) => {
      RootStore.localizationStore.strings = result;
      RootStore.localizationStore.isLoading = false;
    });

    RootStore.formStore.generateCardForm("gosell-gateway-element-container");
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      RootStore.configStore.setConfig(nextProps, "GOSELLELEMENTS");
    }

    return null;
  }

  config(props) {
    RootStore.configStore.setConfig(props, "GOSELLELEMENTS");
  }

  closeNotification() {
    RootStore.uIStore.getErrorHandler = {};
  }

  render() {
    return (
      <React.Fragment>
        {RootStore.uIStore.generateCustomNotification}

        <form
          id="gosell-gateway-form-container"
          method="post"
          ref={(node) => (this.cardElementsRef = node)}
        >
          <div id="gosell-gateway-element-container"></div>
        </form>
      </React.Fragment>
    );
  }
}

export default observer(GoSellElements);
