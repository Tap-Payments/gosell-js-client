import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Social from './Social';
import Separator from './Separator';
import businessStore from '../Store/BusinessStore.js';
import gatewayStore from '../Store/GatewayStore.js';
import styled from "styled-components";
import SocialIcon from './SocialIcon';
import '../assets/css/businessInfo.css';

class BusinessInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      isClicked: false,
      hoverStyle: {
        display: 'flex',
        height: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        visibility: 'visible',
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: '10px'
      }
    }
  }

  handleSelfClick = (contact) => {
      this.setState({
        isClicked: !this.state.isClicked
      })

  }

  handleClick = (contact) => {

    switch (contact.type) {
      case 'email':
        window.location.href = "mailto:"+contact.value;
        break;
      case 'phone':
        window.location.href = "tel:"+contact.value;
        break;
      case 'web':
        window.open(contact.value,'_blank');
        break;
    }
  }

  render() {

    const Business = styled.div`
      ${this.props.style};
    `
    var self = this;

    var contactIcons = null, more = null, socialIcons = null;
    var darkView = null;

    if(businessStore.getContact){
      contactIcons = businessStore.getContact.map((contact, index) =>
          contact.type !== 'social' ?
            <SocialIcon
              key={'div-'+index}
              mode={'self'}
              style={{width: '40px', height: '40px', '&:hover': {backgroundColor: contact.color}}}
              img={contact.img}
              width="18" height="18"
              alt={contact.key}
              onClick={this.handleSelfClick.bind(this, contact)}>
            </SocialIcon>
          : null
      );

      more = businessStore.getContact.map((contact, index) =>
          contact.type !== 'social' ?
            <div key={'div-'+index}>
              {contact.value}
            </div>
          : null
      );

      socialIcons = businessStore.getContact.map((contact, index) =>
          contact.type === 'social' ?
            <SocialIcon
              key={'div-'+index}
              mode={'blank'}
              url={contact.value}
              style={{
                width: '40px',
                height: '40px',
                '&:hover':{
                  backgroundColor: contact.color
                }
              }}
              img={contact.img}
              width="18" height="18"
              alt={contact.key}
              onClick={this.handleClick.bind(this, contact)}>
            </SocialIcon>
          : null
      );

      var styles = {};
      var align = gatewayStore.getDir === 'ltr' ? 'right' : 'left';

      darkView = businessStore.getContact.map((contact, index) =>
          <div key={'div-'+index}>
            <Social
              id={index}
              key={index}
              dir={gatewayStore.getDir}
              style={{
                'iconStyle':{
                  width: this.props.width,
                  height: '60px',
                  '&:hover': {
                    backgroundColor: contact.color,
                    width: contact.type === 'phone' ? '190px' : '60px',
                    cursor: contact.type === 'phone' ? 'default' : 'pointer',
                  },
                  '&:first-child': {
                    borderTopRightRadius: align === 'right' &&  index === 0 ? '8px' : '0',
                    borderTopLeftRadius: align === 'left' && index === 0 ? '8px' : '0'
                  },
                  '&:last-child': {
                    borderBottomRightRadius: align === 'right' && index === 9 ? '8px' : '0',
                    borderBottomLeftRadius: align === 'left' && index === 9 ? '8px' : '0'
                  }
                }
              }}
              icon={<img src={contact.img} width="18" height="18" alt={contact.key}/>}
              info={contact.value}
              expand={contact.type === 'phone' ? true : false}
              onClick={this.handleClick.bind(this, contact)}
              addArrow={false}
              />

            <Separator key={'separator-'+index} style={{borderColor: '#737373'}}/>
          </div>
      );

    }

    return (
      <Business className={align+"-business-info"}>
        {gatewayStore.getIsMobile ?
            <React.Fragment>
              <Separator />
              {gatewayStore.getDesc ?
                <React.Fragment>
                  <Row
                    dir={gatewayStore.getDir}
                    style={{'rowContainer': { backgroundColor: 'white', height: '72px'}}}
                    rowTitle={{'secondary': gatewayStore.getDesc}}
                    addArrow={false}/>
                  <Separator />
                </React.Fragment>
              : null}

              {socialIcons != null || contactIcons != null ?
              <Label title="Social Media" dir={gatewayStore.getDir}></Label> : null}

              {contactIcons != null ?
              <div className="tap-social-btn-container">
                  {contactIcons}
              </div>
              : null}

              {socialIcons != null ?
              <div className="tap-social-btn-container">
                  {socialIcons}
              </div> : null}
            </React.Fragment>
          :
          darkView
        }
      </Business>
    );
  }

}

export default observer(BusinessInfo);
