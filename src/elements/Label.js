import React, { Component }  from 'react';
import '../assets/css/label.css';

class Label extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {

    return (
      <div className="gosell-gateway-label-container" dir={this.props.dir} style={this.props.style ? this.props.style.labelContainer : null}>
          <p className="gosell-gateway-label" style={this.props.style ? this.props.style.labelText : null}>{this.props.title}</p>
          {this.props.edit ? <div className="gosell-gateway-edit" style={{textAlign: this.props.dir === 'ltr' ? 'right' : 'left'}}>
            <div onClick={this.props.handleClick}>{this.props.edit}</div>
            </div>
          : null}
      </div>
    );
  }
}

export default Label;
