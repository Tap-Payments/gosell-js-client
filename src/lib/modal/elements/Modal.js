import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import NaviButton from "./modalNavigator/NaviButton";
import "../assets/css/styles.css";
import styled from "styled-components";
import clearIcon from "../assets/icons/clear.svg";
// import ReactDOM from 'react-dom';

const propTypes = {
  id: PropTypes.string.isRequired
};

class Modal extends React.Component {
  static modals = [];

  static open = id => {
    let modal = Modal.modals.find(x => x.props.id === id);
    // console.log('modal', modal);

    modal.setState({ isOpen: true, isOpenWait: "tap-payments-show-modal" });

    modal.props.blur ?  modal.addBlur() : null;

    // console.log("open");

    if(modal.props.animate){
      setTimeout(function(){
        modal.setState({ isOpenWait: "tap-payments-show-modal tap-payments-animate-up" });
      }, modal.animationDelayTime.show);
    }
    else {
      modal.setState({ isOpenWait: "tap-payments-show-modal tap-payments-modal"});
    }

    var mymd = document.getElementById("mymd");

    document.body.classList.add('tap-payments-modal-open');
  };

  static close = id => {

    let modal = Modal.modals.find(x => x.props.id === id);
    // console.log('modal props', modal.props);
    if(modal.props.animate){

      setTimeout(function() {
        modal.setState({ isOpenWait: "tap-payments-hide-modal tap-payments-animate-down", loading: modal.props.isLoading });
      }, modal.animationDelayTime.hide);

      setTimeout(function() {
        modal.props.blur ?  modal.removeBlur() : null;

        document.body.classList.remove('tap-payments-modal-open');

        modal.setState({ isOpen: false , isOpenWait: "tap-payments-modal-open" });

        if(modal.props.onClose) modal.props.onClose(id);

      }, 1200);

    }
    else {
      modal.props.blur ?  modal.removeBlur() : null;

      document.body.classList.remove('tap-payments-modal-open');

      modal.setState({ isOpen: false });

      if(modal.props.onClose) modal.props.onClose(id);
    }
  };

  constructor(props) {
    super(props);
    // this.state = {
    //   isOpen: false,
    //   loading: this.props.isLoading,
    //   isOpenWait: "tap-payments-show-modal",
    //   modalStyle: {},
    //   bodyStyle: {},
    //   bodyContainerStyle: {},
    //   btnStyle: {},
    //   dir: "ltr",
    //   width: 400
    // };

    this.handleClose = this.handleClose.bind(this);
    this.bodyPrevStyle = null;
    this.animationDelayTime = { hide: 500, show: 700 };
    this.scrollerSize = 0;

  }

  state = {
    isOpen: false,
    loading: true,
    isOpenWait: "tap-payments-show-modal",
    modalStyle: {},
    bodyStyle: {},
    bodyContainerStyle: {},
    btnStyle: {},
    dir: "ltr",
    width: 400
  };

  addBlur(){
    var body =  document.body.children;

    for(var i=0; i<body.length; i++){
      if(body[i].tagName === 'DIV' && !body[i].classList.contains('tap-payments-modal-container')){
        // console.log('body ', body[i].tagName);
        body[i].classList.add('tap-payments-modal-blur-bg');
        break;
      }
    }
  }

  removeBlur(){
    var body =  document.body.children;

    for(var i=0; i<body.length; i++){
      if(body[i].tagName === 'DIV' && body[i].classList.contains('tap-payments-modal-blur-bg')){
        // console.log('body ', body[i]);
        body[i].classList.remove('tap-payments-modal-blur-bg');
        break;
      }
    }

  }

  componentWillMount() {

    // console.log('& will mount');
    if (window && document.body) {
      //search for scroller size
      this.scrollerSize = window.innerWidth - document.body.clientWidth;
      // save body style to re-assign it
      this.bodyPrevStyle = document.body.style;
    }

    this.setState({
      isOpen: this.props.open,
      isOpenWait: "tap-payments-show-modal"
    });

    if(this.props.open){
      document.body.classList.add('tap-payments-modal-open');
      this.props.blur ? this.addBlur() : null;
    }
    else {
      document.body.classList.remove('tap-payments-modal-open');
      this.props.blur ? this.removeBlur() : null;
    }

    this.ModalSettings(this.props);
  }

  ModalSettings(props){

    if (window && document.body) {
      //search for scroller size
      this.scrollerSize = window.innerWidth - document.body.clientWidth;
      // save body style to re-assign it
      this.bodyPrevStyle = document.body.style;
    }

    if(props.animate && props.open){
      var self = this;
      setTimeout(function(){
        self.setState({ isOpenWait: "tap-payments-show-modal tap-payments-animate-up"});
      }, self.animationDelayTime.show);
    }
    else if(!props.animate && props.open){
      this.setState({ isOpenWait: "tap-payments-show-modal tap-payments-modal"});
    }

    if(!props.isLoading){
      var self = this;
      setTimeout(function(){
        self.setState({ loading: self.props.isLoading});
      }, self.animationDelayTime.show);

    }

    if(props.open && props.animate && !props.isLoading){
      var self = this;
      setTimeout(function(){
        self.setState({ isOpenWait: "tap-payments-show-modal tap-payments-animate-up", loading: props.isLoading });
      }, self.animationDelayTime.show);
    }
    else {
        this.setState({ loading: props.isLoading });
    }

    if (props.width) {
      this.setState({
        width: props.width
      });
    }

    if (props.style) {

      let modalStyle = Object.assign({ width: this.state.width + "px" }, props.style.modal);

      if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
      {
        modalStyle.height ? modalStyle.height = '' : null;
      }

      this.setState({
        modalStyle: modalStyle,
        bodyStyle: props.style.body,
        bodyContainerStyle: props.style.bodyContainer
      });
    }

    if (props.dir) {
      this.setState({
        dir: props.dir
      });
    }

    if (!props.header) {
      this.setState({
        bodyStyle:  Object.assign({
          borderTopRightRadius: "8px",
          borderTopLeftRadius: "8px"
        }, this.state.bodyStyle)
      });
    }
  }

  componentDidMount() {
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.modaldialog);

    // add this modal instance to the modal service so it's accessible from other components
    Modal.modals.push(this);
  }

  shouldComponentUpdate(nextProps, nextState) {

      if(nextProps.open  ==  this.props.open
        && nextProps.isLoading == this.props.isLoading
        && nextProps.children == this.props.children
        && nextProps.header == this.props.header){
          // console.log('000 false');
        return false;
      }
      else {
        return true;
      }
  }

  componentWillReceiveProps(nextProps) {

      this.setState({
        isOpen: nextProps.open,
        loading: nextProps.isLoading,
      });

      if(nextProps.open){
        document.body.classList.add('tap-payments-modal-open');
        nextProps.blur ? this.addBlur() : null;
      }
      else {
        document.body.classList.remove('tap-payments-modal-open');
        nextProps.blur ? this.removeBlur() : null;
      }

      this.ModalSettings(nextProps);

  }

  componentWillUnmount() {
    this.props.onClose ? this.props.onClose() : null;

    // remove this modal instance from modal service
    Modal.modals = Modal.modals.filter(x => x.props.id !== this.props.id);

    this.setState({
      isOpen: false,
      loading: false,
      isOpenWait: null,
      modalStyle: {},
      bodyStyle: {},
      bodyContainerStyle: {},
      dir: 'ltr',
      width: 400
    });

    document.body.classList.remove('tap-payments-modal-open');
    this.props.blur ? this.removeBlur() : null;

    // ReactDOM.unmountComponentAtNode(document.getElementById(this.props.id));

    this.modaldialog.remove();

  }

  handleClose(e) {
    // close modal on background click
    if (e.target.className === "closeIn" ||
      e.target.className === "tap-payments-modal-background-color closeOut" ||
      e.target.className === "tap-payments-modal-background-color closeInOut") {
        // console.log('close it from close in');
        Modal.close(this.props.id);
    }
  }
  render() {
    // console.log('close it is hidden: ', !this.state.isOpen);
    return (
      <div
        id={this.props.id}
        className="tap-payments-modal-container"
        dir={this.state.dir}
        style={!this.state.isOpen ? {display: 'none'} : {}}
        onClick={this.handleClose}
        ref={el => (this.modaldialog = el)}>

        {this.props.notification}

        {this.state.isOpen && this.state.loading ?
          this.props.loader
         :
          <div className={this.state.isOpenWait} style={this.state.modalStyle}>

            <div className="tap-payments-modal-wrapper">
              {(this.state.dir=='ltr'?this.props.onClickBack:this.props.onClickNext)&&
                <NaviButton type='back' onClick={this.state.dir=='ltr'?this.props.onClickBack:this.props.onClickNext}/>
              }

              {(this.state.dir=='ltr' ? this.props.onClickNext : this.props.onClickBack) &&
                <NaviButton type='next' onClick={this.state.dir=='ltr' ? this.props.onClickNext : this.props.onClickBack}/>
              }
              {this.props.close == "closeIn" || this.props.close == "closeInOut" ? (
                <div className="tap-payments-header-close-icon closeIn"
                  onClick={this.handleClose}
                  style={
                    this.state.dir == 'rtl' ? {left: '0',right: 'unset'} : {right: '0',left: 'unset'}
                  }>
                  <img className="closeIn"
                    src={this.props.closeIcon}
                    width="18"
                    height="18"
                    alt="close"/>
                </div>
              ) : null}

              {this.props.header ? <React.Fragment>{this.props.header}</React.Fragment> : null}

              <div className="tap-payments-modal-body" style={this.state.bodyStyle}>
                <div className="tap-payments-body-container" style={this.state.bodyContainerStyle}>
                  {this.props.children}
                </div>
              </div>

              {this.props.footer ? <div>{this.props.footer}</div> : null}
            </div>

          </div>
        }

        {this.props.mode === 'page' ?
          <div className="tap-payments-page" style={{backgroundColor: this.props.pageBgColor}}>
            {this.props.pageBgImg ? <img className="tap-payments-page-bg-img" src={this.props.pageBgImg} style={this.props.pageBgStyle} alt="background-img"/> : null}
          </div>

          : this.props.mode === 'popup'?
            <div className={"tap-payments-modal-background-color "+this.props.close} onClick={this.handleClose}></div> : null}
        </div>
    );
  }
}
Modal.defaultProps = {
  closeIcon: clearIcon
};

Modal.propTypes = propTypes;

export { Modal };
