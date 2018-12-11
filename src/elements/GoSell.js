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
import RootStore from '../Store/RootStore.js';

class GoSell extends Component {

  static open(e){
    RootStore.uIStore.setOpenModal(true);
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

    RootStore.uIStore.startLoading('loader', 'Please Wait');
    RootStore.configStore.config(this.props);

  }

  componentDidMount() {

    //getting tap id after successful charge, it uses to call getCharge API and display notifications for the user
    var urlParams = new URLSearchParams(window.location.search);
    var tap_id = null;

     if(urlParams.has('tap_id')){
      tap_id = urlParams.get('tap_id');
     }

    RootStore.uIStore.notifications = this.props.notifications;

    RootStore.apiStore.init(tap_id).then(result => {

      if(result == null || result.status !== 'success'){
        RootStore.uIStore.stopLoading();
        RootStore.uIStore.setOpenModal(false);
      }
      else {
        RootStore.uIStore.stopLoading();
      }

    });

    window.addEventListener('resize', this.handleWindowSizeChange);
    //window.addEventListener('resize', this.handleUI);
  }

  componentWillReceiveProps(nextProps){
    RootStore.uIStore.setOpenModal(nextProps.open);
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
    RootStore.apiStore.getErrorHandler.visable = false;
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
          'body': {backgroundColor: '#E9E9E9', height: 'fit-content', minHeight: '450px'}
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
    if(RootStore.uIStore.getActivePage === 1 && RootStore.uIStore.getSubPage === 1){
      RootStore.uIStore.getIsMobile ? RootStore.uIStore.setSubPage(1) : RootStore.uIStore.setSubPage(-1);
      RootStore.uIStore.setActivePage(0);
    }
    else if(RootStore.uIStore.getActivePage === 1 && RootStore.uIStore.getSubPage === 0){
      RootStore.uIStore.setActivePage(0);
      RootStore.uIStore.setSubPage(1);
      RootStore.uIStore.setActivePage(1);
    }
    else{
      RootStore.uIStore.setSubPage(1);
      RootStore.uIStore.setActivePage(1);
    }
  }

  closeNotification(){
    RootStore.apiStore.getErrorHandler.visable = false;
  }


  render() {

    // var msg = null;

    // if(this.props.notifications != null){
    //   msg = document.getElementById(this.props.notifications).innerHTML = RootStore.apiStore.getErrorHandler.msg;
    // //  document.body.appendChild(msg);
    // }
//{this.props.notifications === 'standard' ?   RootStore.uIStore.getLoadingStatus
//: null}

    return(
        <React.Fragment>

            <NotificationBar
              mode={RootStore.apiStore.getErrorHandler.type}
              close={this.closeNotification.bind(this)}
              show={RootStore.apiStore.getErrorHandler.visable}
              options={RootStore.apiStore.getErrorHandler.options}>
                {RootStore.apiStore.getErrorHandler.msg}
            </NotificationBar>

            <Modal id="payment-gateway"
                open={RootStore.uIStore.getOpenModal}
                isLoading={RootStore.uIStore.getLoadingStatus}
                loader={<TapLoader
                  type={RootStore.apiStore.getMsg.type}
                  status={RootStore.uIStore.load}
                  color={'white'}
                  duration={5}
                  title={RootStore.apiStore.getMsg.title}
                  desc={RootStore.apiStore.getMsg.desc}
                />}
                animate={true}
                style={this.state.modalStyle}
                mode={'popup'}
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
                        {RootStore.uIStore.getIsMobile ?
                          <MobileView store={RootStore} />
                        : <MainView store={RootStore} /> }
               </Modal>
          </React.Fragment>
      );

  }
}

export default observer(GoSell);
