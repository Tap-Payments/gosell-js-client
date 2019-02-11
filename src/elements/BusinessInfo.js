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
      height: 'auto',
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
  //
  // componentDidMount(){
  //   this.setState({
  //     height: this.props.store.uIStore.getIsMobile ? '100%' : 'auto',
  //   });
  // }

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
    var self = this;

    let store = this.props.store;

    const Business = styled.div`
      width: ${this.props.width};
      height: ${this.props.height};
      background: rgba(255, 255, 255, 0.6);
      overflow: ${store.uIStore.isMobile ? "scroll" : ""};
      `

    //${store.uIStore.modal_mode === 'page' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0,0,0,0.30)' }

    const Effect = styled.div`
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: -9;
        bottom: 0;
        filter: blur(8px);
        -webkit-filter: blur(8px);`

    var contactIcons = [], more = null, socialIcons = [];
    var darkView = null, lightView = null;

    if(store.merchantStore.contact){

    store.merchantStore.contact.map((contact, index) => {
        if(contact.type !== 'social'){
          contactIcons.push(
            <div className="tap-contact-btn-container" key={'div-'+index} onClick={this.handleClick.bind(this, contact)}>
              <SocialIcon
                key={'contact-'+index}
                mode={'self'}
                style={{width: '40px', height: '40px', '&:hover': {backgroundColor: contact.color}}}
                img={contact.img}
                width="18" height="18"
                alt={contact.key}
                onClick={this.handleClick.bind(this, contact)} />
              <div style={{pointerEvents: 'none', color:'#535353'}}>{contact.value}</div>
            </div>);
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
                  width: '65px',
                  height: '65px',
                  '&:hover': {
                    backgroundColor: contact.color,
                    width: contact.type === 'phone' ? '190px' : '65px',
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
              {(index + 1) != store.merchantStore.contact.length ?
                <Separator key={'separator-'+index} style={{borderColor: '#737373'}}/> : null}
          </div>
      );

      console.log('store.merchantStore.contact', store.merchantStore.contact);
      lightView = store.merchantStore.contact.map((contact, index) =>
          <div key={'social-light-'+index}>
            <Social
              id={index}
              key={'contact-'+index}
              dir={store.uIStore.getDir}
              style={{
                'iconStyle':{
                  width: '65px',
                  height: '65px',
                  '&:hover': {
                    backgroundColor: contact.color,
                    width: contact.type === 'phone' ? '190px' : '65px',
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
              {(index + 1) != store.merchantStore.contact.length ?
                <Separator key={'separator-'+index} style={{borderColor: '#fff', top: (65 * index) + 'px'}}/> : null}

          </div>
      );

    }

    return (
      <Business id='gosell-business-info' className={align+"-business-info"}>
        {store.uIStore.getIsMobile ?
            <React.Fragment>
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
          <React.Fragment>
             {lightView}
             <Effect />
          </React.Fragment>
        }
      </Business>
    );
  }

}

export default observer(BusinessInfo);
