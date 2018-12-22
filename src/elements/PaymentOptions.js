import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Pay from './Pay';
import Save from './Save';


class PaymentOptions extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount(){
    this.props.store.uIStore.setPageIndex(0);
  }

  render() {

    let store = this.props.store;

    switch (store.configStore.transaction_mode) {
      case 'charge':
        return (<Pay store={store}/>);
        break;
      case 'authorize':
          return (<Pay store={store}/>);
          break;
      case 'save_card':
          return (<Save store={store}/>);
          break;
      case 'get_token':
          return (<Save store={store}/>);
          break;
      default:
          return(null);
          break;
    }

  }
}

export default observer(PaymentOptions);
