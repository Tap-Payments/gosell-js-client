import React, { Component }  from 'react';
import '../assets/css/alert-icons.css';

class AlertIcon extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {

    return (
      <div className="tap-alert-icon-container" dir={this.props.dir} style={this.props.style ? this.props.style.alertContainer : null}>

      {this.props.type === 'error' ?
        <div className="tap-modal-icon tap-modal-error scaleError">
          <span className="tap-modal-x-mark">
            <span className="tap-modal-line tap-modal-left pulseErrorIns"></span>
            <span className="tap-modal-line tap-modal-right pulseErrorIns"></span>
          </span>
        </div>
      : null}

      {this.props.type === 'warning' ?
        <div className="tap-modal-icon tap-modal-warning scaleWarning">
          <span className="tap-modal-body pulseWarningIns"></span>
          <span className="tap-modal-dot pulseWarningIns"></span>
        </div>
      : null }

      {this.props.type === 'success' ?
        <div className={this.props.animate ? "circle-loader load-complete" : "circle-loader"}>
          <div className="checkmark draw" style={!this.props.animate ? {display: 'none'} : null}></div>
        </div>
      : null}

      </div>
    );
  }
}

export default AlertIcon;
