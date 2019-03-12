import React, { Component }  from 'react';
import '../assets/css/separator.css';

class Separator extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className="gosell-gateway-separator" style={this.props.style ? this.props.style : null}></div>
    );
  }
}

export default Separator;
