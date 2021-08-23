import React, { Component } from "react";
import "../assets/css/notifications.css";

class NotificationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modeStyle: null,
      show: this.props.show ? true : false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mode === "success") {
      return {
        modeStyle: {
          backgroundColor: "#2ACE00",
          color: "#fff",
        },
        show: nextProps.show,
      };
    } else if (nextProps.mode === "error") {
      return {
        modeStyle: {
          backgroundColor: "#E12131",
          color: "#fff",
        },
        show: nextProps.show,
      };
    } else if (nextProps.mode === "warning") {
      return {
        modeStyle: {
          backgroundColor: "#ffbf00",
          color: "#fff",
        },
        show: nextProps.show,
      };
    } else if (nextProps.mode === "info") {
      return {
        modeStyle: {
          backgroundColor: "#009AFF",
          color: "#fff",
        },
        show: nextProps.show,
      };
    }
  }

  handleClose() {
    this.setState({
      show: false,
    });

    this.props.close ? this.props.close() : null;
  }

  render() {
    // var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    var options = this.props.options
      ? this.props.options.map(function(option, index) {
          return (
            <div
              className="tap-payments-option"
              key={index}
              onClick={option.action}
            >
              {option.title === "×" ? (
                <a className="tap-payments-close">{option.title}</a>
              ) : (
                option.title
              )}
            </div>
          );
        })
      : null;

    return (
      <table
        dir={this.props.dir}
        className={
          this.state.show
            ? "tap-payments-notification-bar tap-payments-notification-true"
            : "tap-payments-notification-bar tap-payments-notification-false"
        }
        style={Object.assign({}, this.state.modeStyle, this.props.style)}
      >
        <tbody>
          <tr>
            <td
              align={this.props.dir == "rtl" ? "right" : "left"}
              className={
                this.props.options
                  ? "tap-payments-notification-title"
                  : "tap-payments-notification-title tap-payments-notification-title-centered"
              }
              onClick={this.props.onClick}
            >
              <div
                style={{
                  textAlign: this.props.dir == "rtl" ? "right" : "left",
                }}
              >
                {this.props.children}
              </div>
            </td>
            <td
              align={this.props.dir == "rtl" ? "left" : "right"}
              className={
                this.props.options
                  ? "tap-payments-options"
                  : "tap-payments-options tap-payments-options-close-only"
              }
            >
              {this.props.options ? (
                options
              ) : (
                <a
                  className="tap-payments-close"
                  onClick={this.handleClose.bind(this)}
                  title="close"
                >
                  {this.props.children ? "×" : ""}
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default NotificationBar;
