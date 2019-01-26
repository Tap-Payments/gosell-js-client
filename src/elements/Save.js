import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import CardsForm from './CardsForm';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import bill from '../assets/imgs/bill.svg';
import TapButton from './TapButton';
import Otp from './Otp';
import ExtraFees from './ExtraFees';


const styles = {
    'row1':{
      'rowContainer': {
         height: '65px',
         backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
    },
      'textStyle': {width: '100%', textAlign: 'center'},
      'iconStyle': {width: '65px', height: '65px'}
    },
    'row2':{
      'rowContainer': { backgroundColor: 'white',
      '&:hover': {
      //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
      }
    },
      'iconStyle': {width: '65px', height: '48px'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px'
      }
    }
}

class Save extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount(){
    this.props.store.uIStore.setPageIndex(0, 'y');
  }

  handleBtnClick(){

    var store = this.props.store;
    store.uIStore.startBtnLoader();

    if(store.configStore.transaction_mode === 'save_card'){
      store.paymentStore.save_card_active = true;
      store.paymentStore.saveCardOption(true);

      store.formStore.generateToken().then(result => {
        store.apiStore.saveCustomerCard(store.paymentStore.source_id).then(result =>{
          console.log('create card ......>>>>>>>>> ', result);
          store.uIStore.stopBtnLoader();
        });
      });
    }
    else {
      store.formStore.generateToken().then(result => {
          console.log('token ......>>>>>>>>> ', result);
          store.uIStore.stopBtnLoader();
      });
    }
  }

  render() {

    let store = this.props.store;

    var self = this, cards = {};

    return (<div style={{width: '100%', height: '100%', position:'relative'}}>
                  <Separator />
                    <CardsForm ref="paymentForm" store={store} saveCardOption={false}/>
                  <Separator />

                  <div style={{height: '86px', position:'relative'}}>
                      <TapButton
                        id="tap-save-btn"
                        dir={store.uIStore.getDir}
                        width="90%"
                        height="44px"
                        btnColor={'#2ACE00'}
                        active={store.uIStore.pay_btn}
                        animate={this.props.store.uIStore.getBtnLoaderStatus}
                        handleClick={this.handleBtnClick.bind(this)}>{store.configStore.btn}</TapButton>
                  </div>

            </div>);
  }
}

export default observer(Save);
