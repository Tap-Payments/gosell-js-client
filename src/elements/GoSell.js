import React, { Component }  from 'react';
import {observer} from 'mobx-react';
// import {Modal, Header, NotificationBar} from '@tap-payments/modal-fix';
import {Modal, Header, NotificationBar} from '../lib/modal';
import Paths from '../../webpack/paths';
import '../assets/css/style.css';
import MainView from './MainView';
import Details from './Details';
import TapLoader from './TapLoader';
import RootStore from '../store/RootStore.js';
import BackBtn from './BackBtn';

class GoSell extends Component {

  //open Tap gateway as a light box by JS library
  static openLightBox(){
    RootStore.uIStore.modalMode = 'popup';
    RootStore.uIStore.modalID = "gosell-lightbox-payment-gateway";

    GoSell.handleView();

    RootStore.configStore.configure().then(result => {
      // console.log('return', result);
      RootStore.uIStore.startLoading('loader', RootStore.localizationStore.getContent('please_wait_msg', null), null);

      if(result){

        if(!GoSell.showTranxResult()){
            RootStore.apiStore.init(RootStore.configStore.key);
        }
      }

    });

  }

  //function will be used on tap server to generate the UI of the payment gateway
  static generateTapGateway(){

    RootStore.uIStore.modalMode = 'page';
    RootStore.uIStore.modalID = "gosell-payment-gateway-page";

    GoSell.handleView();

    RootStore.configStore.configure().then(result => {
      // console.log('return', result);
      RootStore.uIStore.startLoading('loader', RootStore.localizationStore.getContent('please_wait_msg', null), null);

      if(result){
        if(!GoSell.showTranxResult()){
            RootStore.apiStore.init(RootStore.configStore.key);
        }
      }

    });

  }

  //redirect to Tap gateway from JS library without calling charge / authrorize API from merchant side
  static openPaymentPage(){

    GoSell.handleView();

    RootStore.configStore.configure().then(result => {

      RootStore.uIStore.startLoading('loader', RootStore.localizationStore.getContent('please_wait_msg', null), null);
      RootStore.apiStore.createTransaction().then(result => {
        // console.log('transaction response', result);

        if(result.status == 200){
          window.open(result.data.transaction.url, '_self');
          // GoSell.handleClose();
        }
      }).catch(error => {
        console.log(error);
      })
    });

  }

  static handleView(){

    RootStore.uIStore.setErrorHandler({});
    RootStore.uIStore.startLoading('loader', null, null);
    // RootStore.configStore.configure();
    RootStore.uIStore.setOpenModal(true);

    RootStore.configStore.setGlobalStyle();
  }

  static showTranxResult(){
    var URLSearchParams = require('url-search-params');

    var urlParams = new URLSearchParams(window.location.search);

    console.log('hey', window.location.query);
    var tap_id = null;

    console.log('urlParams', urlParams);
    if(urlParams.has('tap_id')){

      // RootStore.configStore.configure().then(result => {
        GoSell.handleView();
        tap_id = urlParams.get('tap_id');

        console.log('tap_id', tap_id);
        RootStore.apiStore.getTransactionResult(tap_id).then(result => {
          // console.log('init response', result);
          console.log('url', RootStore.configStore.redirect_url);
        });
      // });

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
    this.config(this.props);
    this.handleWindowSizeChange();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);

    this.config(nextProps);
    this.handleWindowSizeChange();
  }

  config(props){
    // console.log('props', props);
    RootStore.configStore.setConfig(props, 'GOSELL');
  }

  componentDidMount() {
    GoSell.showTranxResult();

    RootStore.uIStore.calcModalHeight();
    // window.addEventListener('resize', RootStore.uIStore.calcModalHeight());
    window.addEventListener('resize', this.handleWindowSizeChange);
    window.addEventListener('resize', this.updateDimensions);
  }

  handleClick(){
    RootStore.actionStore.handleBusinessInfoClick();
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
      // console.log('// update dimentions');
      RootStore.uIStore.calcElementsHeight('gosell-gateway-payment-options');
  }

  handleWindowSizeChange(){
    var device = RootStore.uIStore.deviceOS;

    if(window.innerWidth <= 823 && device === 'phone'){
      RootStore.uIStore.setIsMobile(true);
      RootStore.uIStore.setSubPage(-1);
    }
    else {
      RootStore.uIStore.setIsMobile(false);
      RootStore.uIStore.setPageIndex(0, 'x');
    }

    if(window.innerHeight < window.innerWidth && device === 'phone'){
      // this.updateDimensions();
      RootStore.uIStore.setErrorHandler({
        visable: true,
        code: 'error',
        msg: RootStore.localizationStore.getContent('device_rotation_msg', null),
        type: 'warning'
      });
    }
    else{
      // this.updateDimensions();
      RootStore.uIStore.errorHandler.visable = false;
      RootStore.uIStore.setErrorHandler({});
    }
  };

  static handleClose(){
      RootStore.uIStore.setOpenModal(false);
      RootStore.uIStore.isLoading = true;

      RootStore.uIStore.mainHeight = 0;

      RootStore.uIStore.getErrorHandler.visable = false;
      RootStore.uIStore.show_order_details = false;

      RootStore.uIStore.setSubPage(-1);
      RootStore.uIStore.setPageIndex(0, 'x');
      RootStore.actionStore.resetSettings();

      RootStore.configStore.unSetGlobalStyle();

  }

  close(){
    RootStore.uIStore.getErrorHandler.visable = false;
  }

  closeModal(){
    var URLSearchParams = require('url-search-params');

    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('tap_id')){
      var url = document.location.href;
      var url = url.split('?');

      window.open(url[0], '_self');
    }
    else {
      // RootStore.uIStore.setOpenModal(false);
      GoSell.handleClose();
    }
  }

  render() {

    return(
        <React.Fragment>
            <Modal
                id={RootStore.uIStore.modalID}
                open={RootStore.uIStore.openModal}
                onClose={GoSell.handleClose}
                blur={true}
                isLoading={RootStore.uIStore.isLoading}
                loader={<TapLoader
                  type={RootStore.uIStore.msg.type}
                  status={RootStore.uIStore.load}
                  color={RootStore.uIStore.modalMode === 'popup' ? 'white' : 'black'}
                  duration={5}
                  title={RootStore.uIStore.msg.title}
                  desc={RootStore.uIStore.msg.desc}
                  closeTitle={RootStore.localizationStore.strings != null ? RootStore.localizationStore.getContent('close_btn_title', null) : 'Close'}
                  close={RootStore.uIStore.modalMode === 'popup' ? RootStore.uIStore.msg.handleClose : null}
                  handleClose={this.closeModal.bind(this)}
                />}
                animate={true}
                style={RootStore.uIStore.modal.modalStyle}
                mode={RootStore.uIStore.modalMode}
                pageBgImg={RootStore.uIStore.modalMode === 'page'? RootStore.uIStore.modal_bg_img : null}
                pageBgColor={RootStore.uIStore.modalMode === 'page'? '#F0F1F2' : null}
                notification={RootStore.uIStore.generateCustomNotification}
                header={<Header
                  dir={RootStore.uIStore.dir}
                  mode={RootStore.uIStore.modal.mode}
                  modalIcon={<BackBtn store={RootStore} />}
                  modalTitle={<Details store={RootStore}/>}
                  close={RootStore.uIStore.modalMode === 'popup' && RootStore.uIStore.delete_card == null && !RootStore.uIStore.btn.loader ? "closeIn" : "none"}
                  closeIcon={Paths.imgsPath + 'close.svg'}
                  onClose={GoSell.handleClose}
                  style={RootStore.uIStore.modal.headerStyle}
                  separator={false}></Header>}>
                       {!RootStore.uIStore.isLoading ? <MainView store={RootStore} /> : null}
               </Modal>
          </React.Fragment>
      );

  }
}

export default observer(GoSell);
