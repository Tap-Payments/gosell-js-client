import React, {Component} from 'react';
import '../assets/css/styles.css';
import styled from "styled-components";

class Header extends Component{

  constructor(props) {
      super(props);

      // this.state = {
      //    modalHeaderStyle: null,
      //    modalIconStyle: null,
      //    separator: null,
      //    avatarContainerStyle: null,
      //    avatarIconStyle: null,
      //    avatarTitleStyle: null
      // }
  }

  state = {
     mode: null,
     modalHeaderStyle: null,
     modalIconStyle: null,
     separator: null,
     avatarContainerStyle: null,
     avatarIconStyle: null,
     avatarTitleStyle: null
  }

   componentWillMount(){

     this.props.mode ? this.setState({
        mode: this.props.mode
     }) :  null

     if(this.props.style){

       this.props.style.header ? this.setState({
         headerStyle: this.props.style.header
       }) :  null

       this.props.style.iconStyle ? this.setState({
         iconStyle: this.props.style.iconStyle
       }) :  null

       this.props.style.titleStyle ? this.setState({
         titleStyle: this.props.style.titleStyle
       }) :  null
     }

     this.props.separator ? this.setState({
         separator: {borderBottom: '0.5px solid #E1E1E1'}
      }) : this.setState({ separator: {borderBottom: 'none'} })

   }

   shouldComponentUpdate(nextProps, nextState) {
       if(nextProps.mode  ==  this.props.mode){
         return false;
       }
       else {
         console.log('== nextProps.mode', nextProps.mode);
         console.log('== this.props.mode',this.props.mode);

         return true;
       }
   }

  componentWillReceiveProps(nextProps){

    nextProps.mode ? this.setState({
       mode: nextProps.mode
    }) :  null

    if(nextProps.style){

      nextProps.style.header ? this.setState({
         headerStyle: nextProps.style.header
      }) :  null

      nextProps.style.iconStyle ? this.setState({
        iconStyle: nextProps.style.iconStyle
      }) :  null

      nextProps.style.titleStyle ? this.setState({
        avatarTitleStyle: nextProps.style.titleStyle
      }) :  null
    }

    nextProps.separator ? this.setState({
        separator: {borderBottom: '0.5px solid #E1E1E1'}
     }) : this.setState({ separator: {borderBottom: 'none'} })
  }

  handleClose(e){
      this.props.onClose();
  }

  render(){

    if(this.state.mode === 'simple'){

      var Header = styled.div`
        flex-direction: row;
      `;

      var ModalIcon = styled.div`
        display: inline-block;
        float: left;
        float: ${this.props.dir==='rtl'?'right':'left'}
      `;

      var Title = styled.div`
        ${this.state.titleStyle}
      `;
    }
    else {

      var Header = styled.div`
        flex-direction: column;
      `;

      var ModalIcon = styled.div`
        margin-top: -45px;
      `;

      var Title = styled.div`
        line-height: 40px;
        font-weight: 100;
        margin: auto;
        ${this.state.titleStyle}
      `;
    }

    var Circle = styled.div`
        border-radius: 100%;
        background: #fff;
        border: 1px solid #e9e9e9;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        margin: auto;
        ${this.state.iconStyle}
    `;

      return(
          <Header
            className="tap-payments-modal-header"
            dir={this.props.dir? this.props.dir : null}
            style={Object.assign(this.state.separator, this.state.headerStyle)}>

          {this.props.modalIcon?
              <ModalIcon>
                  {typeof this.props.modalIcon === 'object' ?
                  this.props.modalIcon :
                  <img src={this.props.modalIcon} width="100%" style={this.state.iconStyle} alt="Modal Icon"/>}
              </ModalIcon>
           : null}

           {this.props.modalTitle ?
                <Title className="tap-payments-header-title">
                  <div style={this.state.titleStyle}>{this.props.modalTitle}</div>
                </Title>
           : null}

            {(this.props.close == 'closeIn' || this.props.close == 'closeInOut')?
              <div className="tap-payments-header-close-icon closeIn" onClick={this.handleClose.bind(this)} style={this.props.dir == 'rtl' ? {left: '0', right: 'unset'} : {right: '0', left: 'unset'}}>
                  <img className="closeIn" src={this.props.closeIcon} width="18" height="18" alt="close"/>
              </div>
            : null}

            </Header>
        );
  }

}

export default Header;
