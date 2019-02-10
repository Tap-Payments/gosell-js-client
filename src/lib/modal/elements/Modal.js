import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import NaviButton from './modalNavigator/NaviButton'
import '../assets/css/styles.css';
import styled from 'styled-components';

const propTypes = {
  id: PropTypes.string.isRequired
};

class Modal extends React.Component {

  static modals = [];

  static open = (id) => (e) => {
    e.preventDefault();

    let modal = Modal.modals.find(x => x.props.id === id);

    modal.setState({ isOpen: true });

    //console.log('open', modal.state.isOpen);

    setTimeout(function(){ modal.setState({ isOpenWait: "showModal animateUp" }); }, 700);
    var mymd = document.getElementById('mymd');

    document.body.classList.add('modal-open');

  }

  static close = (id) => (e) => {
    e.preventDefault();

    //console.log('close', id);

    let modal = Modal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: false });
    //modal.forceUpdate();

    document.body.classList.remove('modal-open');


  }

  constructor(props) {
    super(props);

    this.state = { isOpen: this.props.open, loading: this.props.isLoading, isOpenWait: "showModal", modalStyle: {}, bodyStyle: {}, bodyContainerStyle: {}, dir: 'ltr', width: 400};

    this.handleClose = this.handleClose.bind(this);

  }

  componentWillMount(){

    this.setState({
      isOpen: this.props.open
    });

    if(this.props.open){
      document.body.classList.add('modal-open');
    }
    else {
      document.body.classList.remove('modal-open');
    }


    if(this.props.animate && !this.props.isLoading){
      var self = this;
      setTimeout(function(){ self.setState({ isOpenWait: "showModal animateUp", loading: this.props.isLoading }); }, 700);
      document.body.classList.add('modal-open');
    }
    // else if(this.props.animate && this.props.isLoading){
    //   console.log('down animation');
    //   var self = this;
    //   setTimeout(function(){ self.setState({ isOpenWait: "hideModal animateDown", loading: this.props.isLoading }); }, 700);
    //   //document.body.classList.remove('modal-open');
    // }

    if(this.props.width){
      this.setState({
        width: this.props.width
      });
    }

    if(this.props.style){
      this.setState({
        modalStyle: this.props.style.modal,
        bodyStyle: this.props.style.body,
        bodyContainerStyle: this.props.style.bodyContainer
      });
    }

    if(this.props.dir){
      this.setState({
        dir: this.props.dir
      });
    }

    if(!this.props.header){

      this.setState({
        bodyStyle: Object.assign(this.state.bodyStyle, {
          borderTopRightRadius: '8px',
          borderTopLeftRadius: '8px'
        })
      });
    }

  }

  componentDidMount() {
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.modaldialog);

    // add this modal instance to the modal service so it's accessible from other components
    Modal.modals.push(this);

  }

  componentWillReceiveProps(nextProps){

    this.setState({
      isOpen: nextProps.open
    });
    // console.log('is loading from modal', nextProps.isLoading);
    // console.log('is animate from modal', nextProps.animate);

    if(nextProps.open){
      document.body.classList.add('modal-open');
    }
    else {
      document.body.classList.remove('modal-open');
    }

    if(nextProps.style){
      this.setState({
        modalStyle: nextProps.style.modal,
        bodyStyle: nextProps.style.body,
        bodyContainerStyle: nextProps.style.bodyContainer
      });
    }


     if(!nextProps.isLoading){ // && nextProps.animate
       var self = this;
       setTimeout(function(){ self.setState({ isOpenWait: "showModal animateUp", loading: nextProps.isLoading }); }, 1000);
       // document.body.classList.add('modal-open');
     }
     else if(nextProps.animate && nextProps.isLoading){
       var self = this;
       self.setState({ isOpenWait: "hideModal animateDown"});
       setTimeout(function(){ self.setState({loading: nextProps.isLoading }); }, 1000);
       // document.body.classList.remove('modal-open');
     }
  }

  componentWillUnmount() {
    // remove this modal instance from modal service
    Modal.modals = Modal.modals.filter(x => x.props.id !== this.props.id);
  //  console.log('elements', this.element);
    //this.element.remove();

    this.setState({ isOpen: false, loading: this.props.isLoading, isOpenWait: null, modalStyle: {}, bodyStyle: {}, bodyContainerStyle: {}, dir: 'ltr', width: 400});

  }

  handleClose(e) {
    //console.log(e.target.className);
    // close modal on background click
    if (e.target.className === 'closeIn' || e.target.className === 'modal-background-color closeOut' || e.target.className === 'modal-background-color closeInOut') {
      Modal.close(this.props.id)(e);
    }
  }


  render() {

    return (
      <div className="modal_container" dir={this.state.dir} style={{display: this.state.isOpen ? '' : 'none'}} onClick={this.handleClose} ref={el => this.modaldialog = el}>
        {this.props.notification}

        {this.state.isOpen && this.state.loading ?
            this.props.loader
            :
            <div className={this.state.isOpenWait}  style={this.state.modalStyle}>
              <div className="modal-wrapper">
                {(this.props.close == 'closeIn' || this.props.close == 'closeInOut')?
                  <div className="header-close-icon closeIn" onClick={this.handleClose} style={this.state.dir == 'rtl' ? {left: '0'} : {right: '0'}}>
                    <img className="closeIn" src={this.props.closeIcon} width="18" height="18" alt="close"/>
                  </div>
                  : null}

                  <div>{this.props.header}</div>

                  <div className="modal-body" style={this.state.bodyStyle}>
                    {(this.state.dir=='ltr'?this.props.onClickBack:this.props.onClickNext)&&
                      <NaviButton type='back' onClick={this.state.dir=='ltr'?this.props.onClickBack:this.props.onClickNext}/>
                    }
                    <div className="body-container" style={this.state.bodyContainerStyle}>
                      {this.props.children}
                    </div>

                    {(this.state.dir=='ltr'?this.props.onClickNext:this.props.onClickBack)&&
                      <NaviButton type='next' onClick={this.state.dir=='ltr'?this.props.onClickNext:this.props.onClickBack}/>
                    }

                  </div>

                  <div>{this.props.footer}</div>
                </div>

              </div>
          }

          {this.props.mode === 'page' ?
            <div className="page" style={{backgroundColor: this.props.pageBgColor}}>
              {this.props.pageBgImg ? <img className="tap-payments-page-bg-img" src={this.props.pageBgImg} style={this.props.pageBgStyle} alt="background-img"/> : null}
            </div>

            : this.props.mode === 'popup'?
              <div className={"modal-background-color "+this.props.close} onClick={this.handleClose}></div> : null}
          </div>

        );
      }
    }



    Modal.propTypes = propTypes;

    export { Modal };
