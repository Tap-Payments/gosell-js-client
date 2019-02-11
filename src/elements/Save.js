import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import CardsForm from './CardsForm';
import TapButton from './TapButton';
import Otp from './Otp';
import ExtraFees from './ExtraFees';
import ReactDOM from "react-dom";


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

  calcHeight(){

      this.props.store.uIStore.setMainHeight(0);

      const node = document.getElementById('form-container');
      console.log('node', node);
      const allDivs = Array.from(node.querySelectorAll("#form-container > div"));
      console.log('node', node.querySelectorAll("#form-container > div"));

      var self = this;
      var total = 0;
      allDivs.forEach(function(element) {
        total += element.clientHeight;
        console.log('height', element.clientHeight);
      });

      this.props.store.uIStore.setMainHeight(total);
  }

  componentDidUpdate(nextProps){

    if(this.props.store.uIStore.mainHeight == 0){
      this.calcHeight();
      console.log('Height didupdate', this.props.store.uIStore.mainHeight);
    }

  }

  componentDidMount(){
    this.props.store.uIStore.setPageIndex(0, 'y');
    this.calcHeight();
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

    if(store.uIStore.getIsMobile){
      var styles = {
        height: '86px',
        position: 'absolute',
        width: '90%',
        bottom: 0,
        top:'86.5%'
      }


    }
    else {
      var styles = {
        height: '86px',
        position: 'relative',
        width: '100%'
      }

    }

    var height = (store.uIStore.mainHeight+ 86) +'px';

    return (<div style={{width: '100%', height: height, position:'relative'}}>
              <Separator />
                <CardsForm ref="paymentForm" store={store} saveCardOption={false}/>
              <Separator />

              {store.uIStore.getPageIndex != 3 && store.uIStore.getPageIndex != 4 ?
              <div style={styles}>

                  <div style={{height: '86px', position:'relative'}}>
                      <TapButton
                        id="tap-save-btn"
                        dir={store.uIStore.getDir}
                        width="90%"
                        height="44px"
                        btnColor={'#2ACE00'}
                        active={store.uIStore.btn.active}
                        animate={this.props.store.uIStore.btn.loader}
                        handleClick={this.handleBtnClick.bind(this)}>{store.configStore.btn}</TapButton>
                  </div>
              </div>
              : null}

            </div>);
  }
}

export default observer(Save);
