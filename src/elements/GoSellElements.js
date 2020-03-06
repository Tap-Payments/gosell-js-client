import React, { Component } from "react";
import { observer } from "mobx-react";
// import NotificationBar from './NotificationBar';
import RootStore from "../store/RootStore.js";

class GoSellElements extends Component {
  constructor(props) {
    super(props);
  }

  static async submit() {
    await RootStore.formStore.generateToken();
  }

  componentWillMount() {
    this.config(this.props);
  }

  componentDidMount() {
    RootStore.apiStore.getLocalization().then(result => {
      RootStore.localizationStore.strings = result;
      RootStore.localizationStore.isLoading = false;
    });

    RootStore.formStore.generateCardForm("gosell-gateway-element-container");
  }

  componentWillReceiveProps(nextProps) {
    this.config(nextProps);
  }

  config(props) {
    RootStore.configStore.setConfig(props);
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
          ref={node => (this.cardElementsRef = node)}
        >
          <div id="gosell-gateway-element-container"></div>
        </form>
      </React.Fragment>
    );
  }
}

export default observer(GoSellElements);
