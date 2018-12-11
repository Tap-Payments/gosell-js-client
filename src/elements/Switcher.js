import React, { Component }  from 'react';
import '../assets/css/switch.css';

class Switcher extends Component {

  constructor(props){
    super(props);

    this.state = {
      enabled: false
    }
    this.check = this.check.bind(this);

  }

  componentWillReceiveProps(nextProps){
    console.log('updated', nextProps.enabled);
    this.setState({
      enabled: nextProps.enabled
    });
  }

  check(e){
    this.refs.check.checked = true;

    var self = this;
    setTimeout(function(){
      if(self.state.enabled){
        console.log('run');
        self.props.onClick(true);
      }
      else {
        console.log('stop');
        self.refs.check.checked = false;
      }
    }, 200);
  }

  render() {

    return (
      <label className="form-switch" onClick={this.props.handleClick} style={this.props.style}>
        <input ref="check" type="checkbox" onChange={this.check}/>
        <i></i>
      </label>
    );
  }
}

export default Switcher;
