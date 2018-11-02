import React, { Component }  from 'react';
import styled from "styled-components";
import '../assets/css/card.css';
import checkmark from '../assets/imgs/checkmark.svg';
import gatewayStore from '../Store/GatewayStore';

class Card extends Component {

  constructor(props){
    super(props);

    this.state = {
      styles: {
        height: this.props.height ? this.props.height : '100px',
        width: this.props.width ? this.props.width : '100px',
      },
      hover: {
        backgroundColor: 'white',
        boxShadow: '0px 0px 4px #2ACE00'
      },
      active: false
    }
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  componentDidMount() {
     document.addEventListener('click', this.handleClickOutside);
   }

   componentWillUnmount() {
     document.removeEventListener('click', this.handleClickOutside);
   }

  handleClick(){
    this.setState({
      active: true
    });
  }

  handleClickOutside(event) {
   if (this.cardRef && (this.cardRef != event.target && !event.target.classList.contains('tap-btn'))) {
     this.setState({
       active: false
     });
   }
 }

  render() {
    return (
      <div
        className={this.state.active ? 'tap-card-container tap-card-active' : 'tap-card-container'}
        id={this.props.id}
        ref={(node) => this.cardRef = node}
        dir={this.props.dir}
        style={this.props.style ? Object.assign({}, this.state.styles, this.props.style) : this.state.styles}
        onClick={this.handleClick.bind(this)}>
          <div className='tap-contents'>{this.props.bank ? <img src={this.props.scheme} width='30'/> : <br style={{lineHeight:'1.5'}}/> }</div>
          <div className='tap-contents'>{this.props.bank ? <img src={this.props.bank} height='27'/> : <img src={this.props.scheme} height='27'/>}</div>
          <div className='tap-contents'>
            <div className={this.state.active ? "checkbox show" : "checkbox"} ></div>
            <div className="last4digits">&nbsp;&nbsp;&#9679;&#9679;&#9679;&#9679; {this.props.last4digits}</div>
          </div>
      </div>
    );
  }
}

export default Card;
