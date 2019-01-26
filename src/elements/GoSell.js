import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import {Modal, Header, NotificationBar} from '../lib/modal/';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import '../assets/fonts/fonts.css';
import '../assets/css/style.css';
import MainView from './MainView';
import TapLoader from './TapLoader';
import RootStore from '../store/RootStore.js';

class GoSell extends Component {

  //open Tap gateway as a light box by JS library
  static openLightBox(e){

    RootStore.uIStore.modal_mode = 'popup';
    GoSell.handleView();

    if(!GoSell.showTranxResult()){
      setTimeout(function(){
        if(RootStore.configStore.legalConfig){
          RootStore.apiStore.init().then(result => {
            console.log('init response', result);
          });
        }
      }, 1000);
    }

  }
  //function will be used on tap server to generate the UI of the payment gateway
  static generateTapGateway(){

    RootStore.uIStore.modal_mode = 'page';

    RootStore.uIStore.startLoading('loader', 'Please Wait', null);

    GoSell.handleView();

    if(!GoSell.showTranxResult()){
      setTimeout(function(){
        if(RootStore.configStore.legalConfig){
          console.log('session ++++++++++ ', RootStore.merchantStore.session);
          RootStore.apiStore.init().then(result => {
            console.log('init response', result);
          });
        }
      }, 1000);
    }
  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage(){
    GoSell.handleView();
    // RootStore.configStore.configure();

    RootStore.apiStore.createTransaction().then(result => {
      console.log('transaction response', result);

      if(result.status == 200){
        window.open(result.data.transaction.url, '_self');
        // GoSell.handleClose();
      }
    });
  }

  static handleView(){
    RootStore.uIStore.getErrorHandler.visable = false;

    RootStore.uIStore.startLoading('loader', 'Please Wait');

    RootStore.uIStore.setOpenModal(true);

    RootStore.configStore.configure();

    var body =  document.body.children;

    for(var i=0; i<body.length; i++){
      if(body[i].tagName === 'DIV' && !body[i].classList.contains('modal_container')){
        console.log('body ', body[i].tagName);
        body[i].classList.add('gosell-modal-blur-bg');
        break;
      }
    }
  }

  static showTranxResult(){
    var urlParams = new URLSearchParams(window.location.search);
    var tap_id = null;

    if(urlParams.has('tap_id')){
      GoSell.handleView();
      tap_id = urlParams.get('tap_id');
      console.log('tap_id', tap_id);
      RootStore.apiStore.getTransactionResult(tap_id).then(result => {
        console.log('init response', result);
        console.log('url', RootStore.configStore.redirect_url);
      });

      return true;
    }
    else {
      return false;
    }
  }

  constructor(props){
    super(props);
    this.state = {
      animate: false,
      mode: 'simple',
      modalStyle: {},
      headerStyle: {}
    }
  }

  componentWillMount() {
    this.handleWindowSizeChange();
    this.config(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleWindowSizeChange();
    console.log('nextProps', nextProps);
    this.config(nextProps);
  }

  config(props){
    console.log('props', props);
    RootStore.configStore.setConfig(props, 'GOSELL');
  }

  componentDidMount() {

    GoSell.showTranxResult();

    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
  //  window.innerWidth <= 500 ? RootStore.uIStore.setIsMobile(true) : RootStore.uIStore.setIsMobile(false);

    if(window.innerWidth <= 500){
      RootStore.uIStore.setIsMobile(true);
      this.handleUI();
    }
    else {
      RootStore.uIStore.setIsMobile(false);
      this.handleUI();
    }
  };

  static handleClose(){
      RootStore.uIStore.setOpenModal(false);
      RootStore.uIStore.getErrorHandler.visable = false;
      RootStore.uIStore.startLoading('loader', 'Please Wait');

      var body =  document.body.children;

      for(var i=0; i<body.length; i++){
        if(body[i].tagName === 'DIV' && body[i].classList.contains('gosell-modal-blur-bg')){
          console.log('body ', body[i]);
          body[i].classList.remove('gosell-modal-blur-bg');
          break;
        }
      }
  }

  handleUI(){

    if(RootStore.uIStore.getIsMobile){
      this.setState({
        animate: true,
        mode: 'simple',
        modalStyle: {
          'modal': {width:'400px', height: '90%'},
          'body': {backgroundColor: '#E9E9E9', height: 'fit-content', maxHeight: '90%'} //overflow: 'scroll',
        },
        headerStyle: {
          'header': {backgroundColor: '#F7F7F7', height: '65px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '40px', height: '40px', borderRadius:'100%'}
        }
      });
    }
    else {

      this.setState({
        animate: false,
        mode: 'advanced',
        modalStyle: {
          'modal': {width:'400px',height: 'fit-content'},
          'body': {backgroundColor: '#E9E9E9', height: 'fit-content', minHeight: '227px'}
        },
        headerStyle: {
          'header': {backgroundColor: '#F7F7F7', height: '100px'},
          'titleStyle': {cursor: 'pointer'},
          'iconStyle': {width: '85px', height: '85px', borderRadius:'100%'}
        }
      });
    }
  }

  handleClick(){
    RootStore.actionStore.handleBusinessInfoClick();
  }

  closeModal(){
    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      window.open(RootStore.configStore.redirect_url, '_self');
    }
    else {
      // RootStore.uIStore.setOpenModal(false);
      GoSell.handleClose();
    }
  }

  render() {

    return(
        <React.Fragment>
            <Modal id="payment-gateway"
                open={RootStore.uIStore.getOpenModal}
                isLoading={RootStore.uIStore.getLoadingStatus}
                loader={<TapLoader
                  type={RootStore.uIStore.getMsg.type}
                  status={RootStore.uIStore.load}
                  color={RootStore.uIStore.modal_mode === 'popup' ? 'white' : 'black'}
                  duration={5}
                  title={RootStore.uIStore.getMsg.title}
                  desc={RootStore.uIStore.getMsg.desc}
                  close={RootStore.uIStore.modal_mode === 'popup' ? RootStore.uIStore.getMsg.handleClose : null}
                  handleClose={this.closeModal.bind(this)}
                />}
                animate={true}
                style={this.state.modalStyle}
                mode={RootStore.uIStore.modal_mode}
                notification={RootStore.uIStore.generateCustomNotification}
                header={<Header
                  dir={RootStore.uIStore.getDir}
                  mode={this.state.mode}
                  modalIcon={RootStore.merchantStore.logo}
                  modalTitle={<a onClick={this.handleClick.bind(this)}>{RootStore.merchantStore.name}</a>}
                  close={RootStore.uIStore.modal_mode === 'popup' ? "closeIn": "none"}
                  closeIcon={closeIcon}
                  onClose={GoSell.handleClose}
                  style={this.state.headerStyle}
                  separator={false}></Header>}>
                  {RootStore.uIStore.getOpenModal ?
                      <MainView store={RootStore} /> : null }
               </Modal>
          </React.Fragment>
      );

  }
}

// (RootStore.uIStore.getIsMobile ?
//   <MobileView store={RootStore} />
// : <MainView store={RootStore} />)

export default observer(GoSell);
