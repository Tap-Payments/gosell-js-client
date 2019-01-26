import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Social from './Social';
import Separator from './Separator';
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
        backgroundColor: 'rgba(0, 0, 0, 0.30)',
        padding: '10px'
      }
    }
  }

  handleSelfClick = (contact) => {
      this.setState({
        isClicked: !this.state.isClicked
      });
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
      ${this.props.style};`

    var self = this;

    let store = this.props.store;

    var contactIcons = [], more = null, socialIcons = [];
    var darkView = null;

    if(store.merchantStore.contact){

    store.merchantStore.contact.map((contact, index) => {
        if(contact.type !== 'social'){
          contactIcons.push(
            <a className="tap-contact-btn-container" key={'div-'+index} onClick={this.handleClick.bind(this, contact)}>
              <SocialIcon
                key={'contact-'+index}
                mode={'self'}
                style={{width: '40px', height: '40px', '&:hover': {backgroundColor: contact.color}}}
                img={contact.img}
                width="18" height="18"
                alt={contact.key}
                onClick={this.handleClick.bind(this, contact)} />
              <div style={{pointerEvents: 'none', color:'#535353'}}>{contact.value}</div>
            </a>);
        }
      });

      store.merchantStore.contact.map((contact, index) =>{
        if(contact.type === 'social'){
          socialIcons.push(<SocialIcon
            key={'social-light-'+index}
            mode={'blank'}
            url={contact.value}
            style={{
              width: '40px',
              height: '40px',
              margin:'5px',
              '&:hover':{
                backgroundColor: contact.color
              }
            }}
            img={contact.img}
            width="18" height="18"
            alt={contact.key}
            onClick={this.handleClick.bind(this, contact)} />);
        }

      });

      console.log('social icons', socialIcons);

      var styles = {};
      var align = store.uIStore.getDir === 'ltr' ? 'right' : 'left';

      darkView = store.merchantStore.contact.map((contact, index) =>
          <div key={'social-dark-'+index}>
            <Social
              id={index}
              key={'contact-'+index}
              dir={store.uIStore.getDir}
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
        {store.uIStore.getIsMobile ?
            <React.Fragment>
              <Separator />
              {store.merchantStore.desc ?
                <React.Fragment>
                  <Row
                    dir={store.uIStore.getDir}
                    style={{'rowContainer': { backgroundColor: 'white', height: 'auto', padding: '16px'}, 'subtitle':{margin: '0'}}}
                    rowTitle={{'secondary': store.merchantStore.desc}}
                    addArrow={false}/>
                  <Separator />
                </React.Fragment>
              : null}

              {contactIcons.length > 0 ?
                <React.Fragment>
                  <Label title="Contact Info" dir={store.uIStore.getDir}></Label>
                  {contactIcons}
                </React.Fragment>

              : null}

              {socialIcons.length > 0 ?
                <React.Fragment>
                  <Label title="Social Media" dir={store.uIStore.getDir}></Label>
                  <div className="tap-social-btn-container">
                    {socialIcons}
                  </div>
                </React.Fragment> : null}
            </React.Fragment>
          :
          darkView
        }
      </Business>
    );
  }

}

export default observer(BusinessInfo);
