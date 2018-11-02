import React, { Component }  from 'react';
import '../assets/css/img.css';

class Img extends Component {

  constructor(props){
    super(props);

    this.state = {}
  }

  render() {

    return (
      <div className="tap-img-container" style={this.props.style ? this.props.style : null}>
        <img src={this.props.imgSrc} width={this.props.imgWidth} height={this.props.imgHeight}/>
      </div>
    );
  }
}

export default Img;
