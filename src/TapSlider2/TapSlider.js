import React, { Component } from 'react';
import {observer} from 'mobx-react';
import store from './TapSliderStore.js'
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

  componentDidMount(props){

    let height = this.props.style.height && this.props.style.height.indexOf('px')?this.props.style.height:null;
    let width = this.props.style.width && this.props.style.width.indexOf('px')?this.props.style.width:null;
    store.setInitialWidth(document.getElementById('tapAwesomeSlider').clientWidth);
    // store.setInitialHeight( document.getElementById('tapAwesomeSlider').clientHeight);

    console.log("width: ", store.sliderInitialWidth);
    console.log("height: ", store.sliderInitialHeight);

    store.addItem(this.props.componentKey);
  }

  componentDidUpdate(prevProps){

    if(prevProps.componentKey!==this.props.componentKey){
      store.slide(this.props.axis, this.props.componentKey);
    }
    else {
      // Same component updated props
      store.setChildren(this.props.children);
      store.updateItem(this.props.componentKey);
    }
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
