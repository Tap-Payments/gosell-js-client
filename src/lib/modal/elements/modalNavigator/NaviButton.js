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
        className='tap-payments-navi-placeholder'
        style={typeSwitch?{right:'0px'}:{left:'0px'}}
        >
        <div
          id={typeSwitch?'tap-payments-next-area':'tap-payments-back-area'}
          onMouseEnter={this.areaMouseEnterHandler}
          onMouseLeave={this.areaMouseLeaveHandler}
          className={this.state.areaMouseEnter?"expand":""}>
        </div>
        <div
          className={this.state.areaMouseEnter?"fadeOut":""}
          id={typeSwitch?'tap-payments-next-button-background':'tap-payments-back-button-background'}
          >
          <img
            className={typeSwitch?'tap-payments-navi-img-next':'tap-payments-navi-img-back'}
            src={ typeSwitch ? arrowReverse : arrow }/>
        </div>
        <button
          onClick={this.props.onClick}
          onMouseEnter={this.areaMouseEnterHandler}
          onMouseLeave={this.areaMouseLeaveHandler}
          id={typeSwitch?'tap-payments-next-button':'tap-payments-back-button'}
          className={this.state.areaMouseEnter?"fadeOut":""}>
        </button>
      </div>

    );

  }
}
export default NaviButton;
