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

    setTimeout(function(){ modal.setState({ isOpenWait: "animatedModal animate" }); }, 700);
    var mymd = document.getElementById('mymd');

    document.body.classList.add('modal-open');

  }

  static close = (id) => (e) => {
    e.preventDefault();

    //console.log('close', id);

    let modal = Modal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: false });

    document.body.classList.remove('modal-open');
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, isOpenWait: "animatedModal", modalStyle: {}, bodyStyle: {}, bodyContainerStyle: {}, dir: 'ltr', width: 400};

    this.handleClose = this.handleClose.bind(this);

  }

  componentWillMount(){

    if(this.props.open){
      this.setState({
        isOpen: this.props.open
      });

      var self = this;
      setTimeout(function(){ self.setState({ isOpenWait: "animatedModal animate" }); }, 700);
      document.body.classList.add('modal-open');
    }

    if(this.props.width){
      this.setState({
        width: this.props.width
      });
    }

    if(this.props.style){
      this.setState({
        modalStyle: Object.assign({width: this.state.width + 'px'}, this.props.style.modal),
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
    if(nextProps.open){
        this.setState({
          isOpen: nextProps.open
        });

        var self = this;
        setTimeout(function(){ self.setState({ isOpenWait: "animatedModal animate" }); }, 700);

        document.body.classList.add('modal-open');
     }
  }

  componentWillUnmount() {
    // remove this modal instance from modal service
    Modal.modals = Modal.modals.filter(x => x.props.id !== this.props.id);
    this.element.remove();
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
          {this.props.isLoading ?
            this.props.loader
            :
            <div className={this.props.animate ? this.state.isOpenWait : "modal"}  style={this.state.modalStyle}>
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
              {this.props.pageBgImg ? <img src={this.props.pageBgImg} style={this.props.pageBgStyle} alt="background-img"/> : null}
            </div>

            : this.props.mode === 'popup'?
            <div className={"modal-background-color "+this.props.close} onClick={this.handleClose}></div> : null
            }

          </div>

        );
      }
    }

    Modal.propTypes = propTypes;

    export { Modal };
