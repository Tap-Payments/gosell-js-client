import React, { Component } from "react";
import Loader from "@tap-payments/loader";
import * as shortWhiteLoader from "../assets/white-loader.json";
import * as shortBlackLoader from "../assets/black-loader.json";

import "../assets/css/style.css";

class TapLoader extends Component {
  state = {
    status: this.props.status,
    type: this.props.type,
    loader: shortWhiteLoader,
    second: true,
    duration: this.props.duration,
  };

  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.load(nextProps);
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status !== prevState.status) {
      return {
        status: nextProps.status,
        type: nextProps.type,
        loader:
          nextProps.color === "white" ? shortWhiteLoader : shortBlackLoader,
        second: null,
        duration: nextProps.duration,
      };
    }

    return null;
  }

  load(value) {
    this.setState({
      status: value.status,
      type: value.type,
      loader: value.color === "white" ? shortWhiteLoader : shortBlackLoader,
      second: null,
      duration: value.duration,
    });
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    let style = {
      position: "relative",
      top: 50 - (Math.floor(window.innerHeight / 100) % 100) + "%",
    };

    return (
      <div
        className="gosell-gateway-msg"
        style={{
          backgroundColor:
            // this.props.store.uIStore.modalMode == "popup"
            // ?
            "rgba(0, 0, 0, 0.6)",
          // : "#f0f1f2"
        }}
      >
        <div
          className="gosell-gateway-msg-wrapper"
          style={window.innerWidth >= 440 ? style : { color: "" }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "auto",
              display: this.state.status ? "block" : "none",
            }}
          >
            <Loader
              toggleAnimation={this.state.status}
              animationData={this.state.loader}
              duration={
                this.state.type != "loader"
                  ? this.state.status
                    ? 4
                    : 3
                  : this.state.duration
              }
              secondData={this.state.second}
              secondDuration={10}
            />
          </div>
          <p
            className="gosell-gateway-msg-title"
            style={{
              color:
                this.props.color === "white" ? this.props.color : "#4b4847",
            }}
          >
            {this.props.title}
          </p>
          <p
            className="gosell-gateway-msg-desc"
            style={{
              color: this.props.color === "white" ? "#a4a5a7" : "#797777",
            }}
          >
            {this.props.desc}
          </p>
          <br />
        </div>
      </div>
    );
  }
}

export default TapLoader;
