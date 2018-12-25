import React, { Component }  from 'react';
import '../assets/css/switch.css';

class Switcher extends Component {

  constructor(props){
    super(props);
    this.state = {
      // enabled: false
    }
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     enabled: nextProps.store.paymentStore.save_card_option
  //   });
  //
  // }

  check(){
    // e.preventDefault();
    var self = this;

    if(self.props.store.configStore.transaction_mode != 'save_card'){
      setTimeout(function(){
          console.log('it is not save card');
          self.props.store.paymentStore.saveCardOption(!self.props.store.paymentStore.save_card_option);

          if(!self.props.store.paymentStore.save_card_active){
            self.props.store.paymentStore.saveCardOption(false);
            self.refs.check.checked = false;
            // self.setState({
            //   enabled: false
            // });
          }
      }, 500);
    }
    else if(self.props.store.configStore.transaction_mode === 'save_card'){
      console.log('it is save card');
      self.props.store.paymentStore.saveCardOption(true);
      self.refs.check.checked = true;

      // self.setState({
      //   enabled: true
      // });
    }
  }

  render() {
    return (
      <label className="form-switch" style={this.props.style}>
        <input ref="check" type="checkbox" onChange={() => this.check()}/>
        <i></i>
      </label>
    );
  }
}

export default Switcher;
