import React, {Component} from 'react';
import '../assets/css/styles.css';

class Button extends Component{

  constructor(props){
      super(props);
  }

  render(){
      return(
        <button className={'tap-payments-btn-part'} style={this.props.style} onClick={this.props.onClick} >
            {this.props.children}
        </button>
        );
  }
}

export default Button;
