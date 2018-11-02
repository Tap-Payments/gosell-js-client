import React, { Component }  from 'react';
import styles from '../assets/css/row.css';
import rightArrow from '../assets/imgs/rightArrow.svg';
import leftArrow from '../assets/imgs/leftArrow.svg';
import styled from "styled-components";

class Row extends Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false
    }

    this.onClickHandler = this.onClickHandler.bind(this)
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

    if(this.props.rowTitle && this.props.rowTitle.main && this.props.rowTitle.secondary){
      var title = ( <Text className="tap-text-container">
          <p className="tap-subtitle" style={this.props.style.subtitle}>{this.props.rowTitle.secondary}</p>
          <p className="tap-title" style={this.props.style.title}>{this.props.rowTitle.main}</p>
        </Text>);
    }
    else if(this.props.rowTitle &&  this.props.rowTitle.main){
      var title = ( <Text className="tap-text-container">
          <p className="tap-title" style={this.props.style.title}>{this.props.rowTitle.main}</p>
        </Text>);
    }
    else if(this.props.rowTitle &&  this.props.rowTitle.secondary){
      var title = ( <Text className="tap-text-container">
          <p className="tap-subtitle" style={this.props.style.subtitle}>{this.props.rowTitle.secondary}</p>
        </Text>);
    }


    return (
      <RowContainer
      className='tap-row-container'
      dir={this.props.dir}
      onClick={this.onClickHandler}>

        <div className="tap-row">
        {this.props.rowIcon ?
          <Icon className="tap-icon">
              {this.props.rowIcon}
           </Icon>
         : null
        }
         {title}

         {(this.props.value) ?
             <div className={this.state.isMouseOver ? "tap-value" : "tap-value hidden-value"}
                style={this.props.dir === 'ltr'? {textAlign: 'right'} : {textAlign:'left'}}>
                {this.props.value}
             </div>
          : null
         }

           {(this.props.addArrow ||  this.props.addArrow === true) ?
             <div className="tap-arrow" style={this.props.dir === 'ltr'? {textAlign: 'right'} : {textAlign:'left'}}>
                <img src={this.props.style.arrowImg? this.props.style.arrowImg : this.props.dir === 'ltr' ? rightArrow : leftArrow } alt="Arrow"/>
             </div>
            : null
           }
          </div>

      </RowContainer>

    );
  }
}

export default Row;