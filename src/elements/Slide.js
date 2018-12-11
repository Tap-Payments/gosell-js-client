import React, { Component }  from 'react';
import '../assets/css/slide.css';

class Slide extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {
    console.log('open? ', this.props.open);

    return (
      <div className={this.props.open ? "tap-hid-box tap-hid-box2" : 'tap-hid-box'} dir={this.props.dir} style={this.props.style ? this.props.style : null}>
        {this.props.children}
      </div>
    );
  }
}

export default Slide;
