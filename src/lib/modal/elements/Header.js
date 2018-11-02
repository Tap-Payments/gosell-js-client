import React, {Component} from 'react';
import '../assets/css/styles.css';
import styled from "styled-components";

class Header extends Component{

  constructor(props) {
      super(props);

      this.state = {
         modalHeaderStyle: null,
         modalIconStyle: null,
         separator: null,
         avatarContainerStyle: null,
         avatarIconStyle: null,
         avatarTitleStyle: null
      }
  }

   componentWillMount(){

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
         separator: {borderBottom: '1px solid #000'}
      }) : this.setState({ separator: {borderBottom: 'none'} })


   }

  componentWillReceiveProps(nextProps){
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
        separator: {borderBottom: '1px solid #000'}
     }) : this.setState({ separator: {borderBottom: 'none'} })
  }

  handleClose(e){
      this.props.onClose();
  }

  render(){

    if(this.props.mode === 'simple'){

      var Header = styled.div`
        flex-direction: row;
      `;

      var ModalIcon = styled.div`
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${this.state.headerStyle.height};
        height: ${this.state.headerStyle.height};
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
        ${this.state.titleStyle}
      `;
    }

    var Circle = styled.div`
        border-radius: 100%;
        background: #fff;
        border: 1px solid white;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        ${this.state.iconStyle}
    `;

      console.log(typeof this.props.modalIcon);

      return(
          <Header className="modal-header" dir={this.props.dir? this.props.dir : null} style={Object.assign(this.state.separator, this.state.headerStyle)}>
          {this.props.modalIcon?
              <ModalIcon>
                <Circle>
                  {typeof this.props.modalIcon === 'object' ?
                  this.props.modalIcon :
                  <img src={this.props.modalIcon} width="100%" style={this.state.iconStyle} alt="Modal Icon"/>}

                </Circle>
              </ModalIcon>
           : null}

           {this.props.modalTitle ?
                <Title className="header-title">
                  <span style={this.state.titleStyle}>{this.props.modalTitle}</span>
                </Title>
           : null}

            {(this.props.close == 'closeIn' || this.props.close == 'closeInOut')?
              <div className="header-close-icon closeIn" onClick={this.handleClose.bind(this)} style={this.props.dir == 'rtl' ? {left: '0'} : {right: '0'}}>
                  <img className="closeIn" src={this.props.closeIcon} width="18" height="18" alt="close"/>
              </div>
            : null}

            </Header>

        );
  }

}

export default Header;