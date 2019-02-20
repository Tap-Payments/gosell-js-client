import React, { Component } from 'react';
import {observer} from 'mobx-react';
import store from './TapSliderStore.js';

let rtime;
let timeout = false;
let delta = 200;

class TapSlider extends Component {
  constructor(props) {
  super(props);
  this.state = {
  };
  }

  componentWillMount(){
    require('./TapSlider.css');
    store.setAnimationDuration(this.props.animationDuration || 700);
    store.setChildren(this.props.children);
    //  pass the props function to the store to be triggered
    if (this.props.animationStatus) {
      store.setAnimationStatusFunction(this.props.animationStatus);
    }
  }

  resetDimintions() {
    store.setInitialWidth(document.getElementById('tapAwesomeSlider').parentNode.clientWidth);
    // store.setInitialHeight( document.getElementById('tapAwesomeSlider').clientHeight);
  }

  componentDidMount(props){
    // this.resetDimintions();
    window.addEventListener("resize", this.resetDimintions.bind(this));
    let height = this.props.style.height && this.props.style.height.indexOf('px')?this.props.style.height:null;
    let width = this.props.style.width && this.props.style.width.indexOf('px')?this.props.style.width:null;
    //store.setInitialWidth(document.getElementById('tapAwesomeSlider').clientWidth);
    // store.setInitialHeight( document.getElementById('tapAwesomeSlider').clientHeight);
    store.addItem(this.props.componentKey);
    console.log('slider height didmount +++ ', this.props.style.height);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.style.height!=this.props.style.height){
      // console.log('slider height from did update : ', nextProps.style.height);
      store.setInitialHeight(nextProps.style.height);
    }

    // console.log('slider height will receive props+++ ', nextProps.style.height);
  }

  componentDidUpdate(prevProps){
    if(prevProps.componentKey!==this.props.componentKey){

      //  to update the height before going next
      if(store.currentItemKey == 0){
        // console.log('height from did update : ', store.activeItemElement.clientHeight);
        store.setInitialHeight(store.activeItemElement.clientHeight);
      }

      //we need it for index no. 3 & 4 on mobile
      if(this.props.style.height){
        store.setInitialHeight(this.props.style.height);
      }

      // console.log('slider height did update +++ ', this.props.style.height);
      store.slide(this.props.axis, this.props.componentKey);
    }
    else {
      // Same component updated props
      store.setChildren(this.props.children);
      store.updateItem(this.props.componentKey);
    }
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.resetDimintions.bind(this));
  }

  render() {
    return (
      <div id='tapAwesomeSlider'
           className='tapAwesomeSlider'
           style={{width:store.sliderInitialWidth, height:store.sliderInitialHeight}} dir={'ltr'}>
            <div id={'tapAwesomeDynamicSlides'} className={'tapAwesomeDynamicSlides'}
                 style={{width: store.sliderDynamicWidth, height: store.sliderDynamicHeight, left: store.sliderLeft, top:store.sliderTop, float:store.SliderFloat, transform: store.transform, pointerEvents:store.pointerEvents, transition: store.activateTransition?'left '+store.animationDuration+'ms, top '+store.animationDuration+'ms':''}}>
            </div>
      </div>
    );
  }
}
TapSlider.defaultProps= {
      animationDuration : 700,
      animationStatus:  false,
    }

export default observer(TapSlider);