import React, { Component }  from 'react';
import styles from '../assets/css/social.css';
import styled from "styled-components";
import gatewayStore from '../Store/gatewayStore';

class Social extends Component {

  constructor(props){
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this)
  }

  onClickHandler(e){
    this.props.onClick(e);
  }

  render() {

    const SocialContainer = styled.div`
      ${this.props.style.SocialContainer};
    `

    var align = gatewayStore.getDir === 'ltr' ? 'right' : 'left';


    var iconStyle = {
      display: 'flex',
      width:'60px',
      height: '60px',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'width 0.5s ease 0.3ms'
    }

    const Icon = styled.div`
      ${Object.assign({}, iconStyle, this.props.style.iconStyle)};
    `

    const Span = styled.span`
      ${this.props.style.textStyle};
    `

    return (
      <SocialContainer
      className="tap-social"
      dir={this.props.dir}
      onClick={this.onClickHandler}>

        {this.props.icon ?
          <Icon className={align+"-social-icon"}>
              <div className={align+"-social-icon-container"}>{this.props.icon}</div>
              {this.props.expand ?
                <React.Fragment>
                  <div className="tap-social-empty"></div>
                  <div className="tap-social-info">
                      {this.props.info}
                  </div>
                </React.Fragment>
              : null
            }
           </Icon>
         : null
        }


      </SocialContainer>

    );
  }
}

export default Social;
