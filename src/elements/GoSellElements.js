import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/fonts/fonts.css';
import {NotificationBar} from '../lib/modal/';
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
    console.log('props', this.props);
    RootStore.configStore.setConfig(this.props, 'GOSELL_ELEMENTS');
    RootStore.configStore.configure();
  }

  componentDidMount(){
    this.cardForm();
  }

  cardForm(){
    RootStore.formStore.generateCardForm();
     window.setInterval(RootStore.formStore.checkFocus, 10);
  }

  componentWillReceiveProps(nextProps) {
    console.log('props', nextProps);
    RootStore.configStore.setConfig(nextProps, 'GOSELL_ELEMENTS');
    RootStore.configStore.configure();
  }

  closeNotification(){
    RootStore.uIStore.getErrorHandler = {};
  }

  render() {

    return(
        <React.Fragment>
            {RootStore.uIStore.generateCustomNotification}

            <form id="form-container" method="post" ref={(node) => this.cardElementsRef = node}>
                <div id="element-container"></div>
            </form>

          </React.Fragment>
      );

  }
}

export default observer(GoSellElements);
