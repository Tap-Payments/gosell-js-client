import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import {Modal, Header, NotificationBar} from '../lib/modal/';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import mainStore from '../Store/MainStore.js';
import gatewayStore from '../Store/GatewayStore.js';
import businessStore from '../Store/BusinessStore.js';
import '../assets/fonts/fonts.css';
import '../assets/css/style.css';
import MainView from './MainView';
import MobileView from './MobileView';
import Message from './Message';
import {Loader} from '@tap-payments/loader';
import * as animationData from '../assets/json/black-loader.json';

class TapGateway extends Component {

  constructor(props){

    super(props);
    this.state = {
      openModal:false,
      animate: false,
      mode: 'simple',
      modalStyle: {},
      headerStyle: {}
    }
  }

  componentWillMount() {
    this.handleUI();
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentDidMount() {
    console.log("data", this.props.data);

    mainStore.init(this.props.pk, this.props.data);

  }

  componentWillReceiveProps(nextProps){
      this.setState({
        openModal: nextProps.open
      });
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    window.innerWidth <= 500 ? gatewayStore.setIsMobile(true) : gatewayStore.setIsMobile(false);
    this.handleUI();
  };

  handleClose(){
    this.setState({
      openModal: false
    });
  }

  handleUI(){
    if(gatewayStore.getIsMobile){
      this.setState({
        animate: true,
        mode: 'simple',
        modalStyle: {
          'modal': {width:'400px', height: '90%'},
          'body': {backgroundColor: 'rgba(247,247,247,0.9)', height: '80%'}
        },
        headerStyle: {
          'header': {backgroundColor: '#eaeaea', height: '65px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '40px', height: '40px'}
        }
      });
    }
    else {
      this.setState({
        animate: false,
        mode: 'advanced',
        modalStyle: {
          'modal': {width:'400px', height: '610px'},
          'body': {backgroundColor: 'rgba(247,247,247,0.9)', height: '508px'}
        },
        headerStyle: {
          'header': {backgroundColor: 'white', height: '100px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '85px', height: '85px'}
        }
      });
    }
  }

  handleClick(){

    if(gatewayStore.getActivePage === 1 && gatewayStore.getSubPage === 1){
      gatewayStore.getIsMobile ? gatewayStore.setSubPage(1) : gatewayStore.setSubPage(-1);
      gatewayStore.setActivePage(0);
    }
    else if(gatewayStore.getActivePage === 1 && gatewayStore.getSubPage === 0){
      gatewayStore.setActivePage(0);
      gatewayStore.setSubPage(1);
      gatewayStore.setActivePage(1);
    }
    else{
      gatewayStore.setSubPage(1);
      gatewayStore.setActivePage(1);
    }
  }

  render() {

    var loading = true;

    if(!gatewayStore.getLoadingStatus){
      if(!businessStore.getLoadingStatus){
        loading = false;
      }
    }

      return(
            <Modal id="payment-gateway"
                open={this.state.openModal}
                isLoading={loading}
                loader={<Message
                  icon={<div  style={{width: '50px', height: '50px', margin: '0px 10px'}}>
                    <Loader
                      toggleAnimation={true}
                      animationData={animationData}
                      duration={5}
                    />
                  </div>}
                  title={'Please Wait'}
                />}
                animate={true}
                style={this.state.modalStyle}
                mode={'popup'}
                header={<Header
                  dir={gatewayStore.getDir}
                  mode={this.state.mode}
                  modalIcon={businessStore.getLogo}
                  modalTitle={<a onClick={this.handleClick.bind(this)}>{businessStore.name}</a>}
                  close="closeIn"
                  closeIcon={closeIcon}
                  onClose={this.handleClose.bind(this)}
                  style={this.state.headerStyle}
                  separator={false}></Header>}
                  notification={<NotificationBar
                    mode={mainStore.getErrorHandler.errorType}
                    show={Object.keys(mainStore.getErrorHandler).length != 0}>{mainStore.getErrorHandler.errorMsg}</NotificationBar>}>
                        {gatewayStore.getIsMobile ? <MobileView /> : <MainView />}
               </Modal>
          );

  }
}

export default observer(TapGateway);
