import React, { Component } from 'react';
import store from './TapSliderStore.js'

class TapSliderItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(){
    if(store.currentItemKey === 0){
      store.sliderInitialHeight = this.tapAwesomeItem.clientHeight;
    }
    console.log('height updated ===================== ', store.sliderInitialHeight);
    console.log('key:::::::::::::::::::::::::::', store.currentItemKey);
  }

  componentDidMount() {
    if(store.currentItemKey === 0){
      store.sliderInitialHeight = this.tapAwesomeItem.clientHeight;
      console.log('height first time ===================== ', store.sliderInitialHeight);
    }

  }

  render() {
    return (
      <div ref={el => (this.tapAwesomeItem = el)}>
        {this.props.child}
      </div>
    );
  }
}

export default TapSliderItem;
