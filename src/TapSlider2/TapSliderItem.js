import React, { Component } from 'react';
// import store from './TapSliderStore.js'
import {observer} from 'mobx-react';

class TapSliderItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.indexZero  = false
  }

  componentDidUpdate(prevProps){
    // console.log('height from did update : ', this.tapAwesomeItem.clientHeight);
    // if(this.props.store.currentItemKey == 0){
    //   console.log('height from did update : ', this.tapAwesomeItem.clientHeight);
    //
    //   this.props.store.setInitialHeight(this.tapAwesomeItem.clientHeight);
    // }
    if(this.props.store.currentItemKey == 0){
        console.log('height from did update : ', this.tapAwesomeItem.clientHeight);

        this.props.store.setInitialHeight(this.tapAwesomeItem.clientHeight);
      }

  }

  componentWillMount(){
    // this._style = this.props.style

  }

  componentDidMount() {
    // if(store.currentItemKey == 0){
    //   store.setInitialHeight(this.tapAwesomeItem.clientHeight);
    // }
    if(this.props.store.currentItemKey == 0){
    this.indexZero  = true
  }

    this.props.store.setActiveItemElement(this.tapAwesomeItem)
  }

  render() {
    return (
      <div ref={el => (this.tapAwesomeItem = el)} style= {this.indexZero?{width: this.props.style.width, height: this.props.style.height}:this.props.style}>
        {this.props.child}
      </div>
    );
  }
}

export default observer(TapSliderItem);
