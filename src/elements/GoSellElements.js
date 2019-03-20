import React, { Component }  from 'react';
import {observer} from 'mobx-react';
// import {NotificationBar} from '@tap-payments/modal-fix';
import {NotificationBar} from '../lib/modal';
import RootStore from '../store/RootStore.js';
import CardsForm from './CardsForm.js';

class GoSellElements extends Component {

  constructor(props){
    super(props);
  }

  static async submit(){
    await RootStore.formStore.generateToken();
  }

  componentWillMount() {
    this.config(this.props);
  }

  componentDidMount(){
    RootStore.formStore.generateCardForm();
  }

  componentWillReceiveProps(nextProps) {
    this.config(nextProps);
    console.log('=== nextProps', nextProps);

  }

  config(props){
    RootStore.configStore.setConfig(props, 'GOSELL_ELEMENTS');
    RootStore.configStore.configure().then(result => {
      console.log('config result', result);
    });
    console.log('=== dir', RootStore.uIStore.dir);
  }

  closeNotification(){
    RootStore.uIStore.getErrorHandler = {};
  }

  render() {

    return(
        <React.Fragment>
            {RootStore.uIStore.generateCustomNotification}

            <form id="gosell-gateway-form-container" method="post" ref={(node) => this.cardElementsRef = node}>
                <div id="element-container"></div>
            </form>

          </React.Fragment>
      );

  }
}

export default observer(GoSellElements);
