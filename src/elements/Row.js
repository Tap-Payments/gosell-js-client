import React, { Component }  from 'react';
import styles from '../assets/css/row.css';
import Paths from '../../webpack/paths';
// import rightArrow from '../assets/imgs/rightArrow.svg';
// import leftArrow from '../assets/imgs/leftArrow.svg';
import styled from "styled-components";

class Row extends Component {

  constructor(props){
    super(props);
    this.state = {
      isMouseOver: false,
      active: false,
    }

    this.onClickHandler = this.onClickHandler.bind(this);

  }

  getRowHeight(){
    // console.log(document.getElementById(this.props.id));
    return document.getElementById(this.props.id)?document.getElementById(this.props.id).clientHeight:null
  }

  onClickHandler(e){
    this.props.onClick(e);
  }

  overHandler(){
    this.setState({
      isMouseOver: true,
    });
  }

  outHandler(){
    this.setState({
      isMouseOver: false,
    });
  }

  render() {

    const RowContainer = styled.div`
      ${this.props.style.rowContainer};
    `

    const Icon = styled.div`
      ${this.props.style.iconStyle};
    `

    const Text = styled.div`
      ${this.props.style.textStyle};
    `
    
    const arrowImg = this.props.style.arrowImg? this.props.style.arrowImg : this.props.dir === 'ltr' ? Paths.imgsPath + 'rightArrow.svg' : Paths.imgsPath + 'leftArrow.svg';
    if(this.props.rowTitle && this.props.rowTitle.main && this.props.rowTitle.secondary){
      var title = ( <Text className="gosell-gateway-row-text-container">
          <p className="gosell-gateway-row-subtitle title-subtitle" style={this.props.style.subtitle}>{this.props.rowTitle.secondary}</p>
          <p className="gosell-gateway-row-title title-subtitle" style={this.props.style.title}>{this.props.rowTitle.main}</p>
        </Text>);
    }
    else if(this.props.rowTitle &&  this.props.rowTitle.main){
      var title = ( <Text className="gosell-gateway-row-text-container">
          <p className="gosell-gateway-row-title" style={this.props.style.title}>{this.props.rowTitle.main}</p>
        </Text>);
    }
    else if(this.props.rowTitle &&  this.props.rowTitle.secondary){
      var title = ( <Text className="gosell-gateway-row-text-container">
          <p className="gosell-gateway-row-subtitle" style={this.props.style.subtitle}>{this.props.rowTitle.secondary}</p>
        </Text>);
    }


    return (
      <RowContainer
      className='gosell-gateway-row-container'
      dir={this.props.dir}
      id={this.props.id}
      ref={(node) => this.rowRef = node}
      onClick={this.onClickHandler}>

        <div className="gosell-gateway-row">
        {this.props.rowIcon ?
           <Icon className="gosell-gateway-row-icon">
              {this.props.rowIcon}
           </Icon>
         : <Icon className="gosell-gateway-row-icon"></Icon>
        }

         {title}

         {(this.props.value) ?
             <div className={this.state.isMouseOver ? "gosell-gateway-value" : "gosell-gateway-value gosell-gateway-hidden-value"}
                style={this.props.dir === 'ltr'? {textAlign: 'right'} : {textAlign:'left'}}>
                {this.props.value}
             </div>
          : null
         }

         {(this.props.addArrow ||  this.props.addArrow === true) ?
           <div className="gosell-gateway-arrow" style={{ backgroundImage: 'url('+ arrowImg +')', height: this.getRowHeight()}}>
          </div>
        : null}

          </div>

      </RowContainer>

    );
  }
}

export default Row;
