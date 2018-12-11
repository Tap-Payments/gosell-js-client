import React, { Component }  from 'react';
import styles from '../assets/css/social.css';
import styled from "styled-components";

class SocialIcon extends Component {

  constructor(props){
    super(props);
  }

  onClickHandler(e){
    this.props.onClick(e);
  }

  render() {
    var socialbtnStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      borderRadius: '8px',
      margin:'5px',
      pointerEvents:'none'
    }

    const SocialBtn = styled.a`
      ${Object.assign({}, socialbtnStyle, this.props.style)};
    `

    return (
      <React.Fragment>
        <SocialBtn
          onClick={this.props.mode === 'self' ? this.onClickHandler.bind(this) : null}
          href={this.props.mode === 'self' ? null : this.props.url}>
          <img src={this.props.img} width={this.props.width} height={this.props.height} alt={this.props.alt}/>
        </SocialBtn>

      </React.Fragment>
    );
  }
}

export default SocialIcon;
