import React, { Component }  from 'react';
import '../assets/css/label.css';

class Label extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {

    return (
      <div className="tap-label-container" dir={this.props.dir} style={this.props.style ? this.props.style.labelContainer : null}>
          <p className="tap-label" style={this.props.style ? this.props.style.labelText : null}>{this.props.title}</p>
      </div>
    );
  }
}

export default Label;
