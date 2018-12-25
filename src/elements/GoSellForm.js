import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/fonts/fonts.css';
import {NotificationBar} from '../lib/modal/';
import RootStore from '../store/RootStore.js';
import CardsForm from './CardsForm.js';

class GoSellForm extends Component {

  constructor(props){
    super(props);
  }

  static submit(){
    RootStore.formStore.generateToken();
  }

  componentWillMount() {
    console.log('props', this.props);
    RootStore.configStore.setConfig(this.props, 'GOSELLFORM');
    RootStore.configStore.configure();
  }

  componentDidMount() {

    var urlParams = new URLSearchParams(window.location.search);
    var tap_id = null;

    if(urlParams.has('tap_id')){
      RootStore.uIStore.startLoading('loader', 'Please Wait');
      RootStore.uIStore.setOpenModal(true);

      tap_id = urlParams.get('tap_id');
      RootStore.apiStore.getTransactionResult(tap_id).then(result => {
        console.log('init response', result);
        console.log('url', RootStore.configStore.redirect_url);
      });
    }

  }
  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  closeNotification(){
    RootStore.uIStore.getErrorHandler = {};
  }

  render() {

    return(
        <React.Fragment>
            {RootStore.uIStore.generateCustomNotification}
            <CardsForm store={RootStore} />
          </React.Fragment>
      );

  }
}

export default observer(GoSellForm);
