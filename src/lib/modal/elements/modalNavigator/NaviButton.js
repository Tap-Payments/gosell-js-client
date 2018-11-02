import React, {Component} from 'react';
import '../../assets/css/naviStyles.css';

import arrow from '../../assets/icons/arrow.svg';
import arrowReverse from '../../assets/icons/arrowReverse.svg';

class NaviButton extends Component{

  constructor(props){
    super(props);

    this.state = {
      areaMouseEnter:false,
    };
    this.areaMouseEnterHandler=this.areaMouseEnterHandler.bind(this);
    this.areaMouseLeaveHandler=this.areaMouseLeaveHandler.bind(this);
  }


  areaMouseEnterHandler(){
    this.setState({areaMouseEnter:true})
    // console.log('mouse down');
  }
  areaMouseLeaveHandler(){
    this.setState({areaMouseEnter:false})
    // console.log('mouse left');
  }

  render(){
    //true = next
    //false = back (default)
    let typeSwitch=this.props.type.toLowerCase()=='next';

    return(
      <div
        className='navi-placeholder'
        style={typeSwitch?{right:'0px'}:{left:'0px'}}
        >
        <div
          id={typeSwitch?'next-area':'back-area'}
          onMouseEnter={this.areaMouseEnterHandler}
          onMouseLeave={this.areaMouseLeaveHandler}
          className={this.state.areaMouseEnter?"expand":""}>
        </div>
        <div
          className={this.state.areaMouseEnter?"fadeOut":""}
          id={typeSwitch?'next-button-background':'back-button-background'}
          >
          <img
            className={typeSwitch?'navi-img-next':'navi-img-back'}
            src={ typeSwitch ? arrowReverse : arrow }/>
        </div>
        <button
          onClick={this.props.onClick}
          onMouseEnter={this.areaMouseEnterHandler}
          onMouseLeave={this.areaMouseLeaveHandler}
          id={typeSwitch?'next-button':'back-button'}
          className={this.state.areaMouseEnter?"fadeOut":""}>
        </button>
      </div>

    );

  }
}
export default NaviButton;
