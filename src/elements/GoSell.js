import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import {Modal, Header, NotificationBar} from '../lib/modal/';
import closeIcon from '../assets/imgs/close.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import '../assets/fonts/fonts.css';
import '../assets/css/style.css';
import MainView from './MainView';
import MobileView from './MobileView';
import TapLoader from './TapLoader';
import RootStore from '../store/RootStore.js';

class GoSell extends Component {

  static open(e){

    RootStore.uIStore.modal_mode = 'popup';
    GoSell.handleView();

    setTimeout(function(){
      if(RootStore.configStore.legalConfig){
        RootStore.apiStore.init().then(result => {
          console.log('init response', result);
          // if(result != null && result.status === 'success'){
          //     RootStore.uIStore.stopLoading();
          // }
        });
      }
    }, 1000);

  }

  static openPage(e){

    RootStore.uIStore.modal_mode = 'page';

    GoSell.handleView();

    setTimeout(function(){
      if(RootStore.configStore.legalConfig){
        RootStore.apiStore.init().then(result => {
          console.log('init response', result);
          // if(result != null && result.status === 'success'){
          //     RootStore.uIStore.stopLoading();
          // }
        });
      }
    }, 1000);

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
    console.log('props', this.props);
    RootStore.configStore.setConfig(this.props, 'GOSELL');
  }

  componentWillReceiveProps(nextProps) {
    this.handleWindowSizeChange();
    console.log('nextProps', nextProps);
    RootStore.configStore.setConfig(nextProps, 'GOSELL');
  }

  componentDidMount() {

    var urlParams = new URLSearchParams(window.location.search);
    var tap_id = null;

    if(urlParams.has('tap_id')){
      GoSell.handleView();

      tap_id = urlParams.get('tap_id');
      RootStore.apiStore.getTransactionResult(tap_id).then(result => {
        console.log('init response', result);
        console.log('url', RootStore.configStore.redirect_url);
      });
    }

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

  handleClose(){
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
          'body': {backgroundColor: '#E9E9E9', height: 'fit-content', maxHeight: '90%'}
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
      this.handleClose();
    }
  }

  render() {
    // {RootStore.uIStore.generateCustomNotification}

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
                  close={RootStore.uIStore.getMsg.handleClose}
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
                  close="closeIn"
                  closeIcon={closeIcon}
                  onClose={this.handleClose.bind(this)}
                  style={this.state.headerStyle}
                  separator={false}></Header>}>
                  {RootStore.uIStore.getOpenModal ?
                      (RootStore.uIStore.getIsMobile ?
                        <MobileView store={RootStore} />
                      : <MainView store={RootStore} />) : null }
               </Modal>
          </React.Fragment>
      );

  }
}

export default observer(GoSell);
