import {decorate, observable} from 'mobx';
import React, { Component}  from 'react';
import ReactDOM from 'react-dom'
import TapSliderItem from './TapSliderItem.js';


class TapSliderStore {

  constructor() {
    this.sliderItems= [];
    this.children = [];
    this.temporeryItemKey = null;
    this.currentItemKey = 0;
    this.sliderInitialWidth = '';
    this.sliderInitialHeight = '';
    this.sliderDynamicWidth= '';
    this.sliderDynamicHeight= '';
    this.sliderHeight = '';
    this.sliderLeft = '0';
    this.sliderTop = '0';
    this.activateTransition= false;
    this.axis='';
    this.SliderFloat='left';
    this.transform = '';
    this.pointerEvents ='';
    this.animationDuration = 0;
    this.newItemId = '';
    this.animationStatus = false;
    this.animationStatusFunction  = false;

  }

  setFirstSliderItem(key){
    this.sliderItems.push(key);
  }

  setChildren(children){
    this.children = children;
  }

  setInitialWidth(width){
    console.log('width -----------------------> ', width);
    this.sliderInitialWidth = width;
  }

  setInitialHeight(height){
    console.log("setInitialHeight ", height);
    this.sliderInitialHeight = height;
  }

  changeDynamicWidth(width){
    this.sliderDynamicWidth = width;
  }

  changeDynamicHeight(height){
    this.sliderDynamicHeight = height;
    //height.toString().indexOf('px')> -1 ? height : height+'px
  }



  setAnimationDuration(animationDuration){
    this.animationDuration  = animationDuration;
  }

  setAnimationStatusFunction(animationStatusFunction){
    this.animationStatusFunction  = animationStatusFunction

    // if (animationStatusFunction) {
    //   this.animationStatusFunction()
    // }
  }


  addItem(key){
    this.currentItemKey =  key;
    console.log("addItem");
    const id = (((1+Math.random())*0x10000)|0).toString(16).substring(1)+''+(((1+Math.random())*0x10000)|0).toString(16).substring(1)+'-item';
    var z = document.createElement('div');
    this.newItemId = id;
    z.id = id;
    z.style='width:'+this.sliderInitialWidth+';height:'+this.sliderInitialHeight+';'
    z.className = 'tapAwesomeItem';
    if(this.axis===''){this.axis='x'}
    if(this.axis==='-x'||this.axis==='-y'){
      document.getElementById('tapAwesomeDynamicSlides').prepend(z);
    }
    if(this.axis==='x'||this.axis==='y'){
      // this.axis === 'y'? document.getElementById('tapAwesomeDynamicSlides').style='display: flex; flex-direction: column;' : null;
      document.getElementById('tapAwesomeDynamicSlides').appendChild(z)
    }
    this.targetElement = document.getElementById(id);
    ReactDOM.render(
      React.createElement(TapSliderItem, {child: this.children[key], className:''}),
      document.getElementById(id)
    );
  }

  //  this function is to pass the higher props the are stopped by the native div
  //  it will rendered updated child

  updateItem(key) {
    this.currentItemKey =  key;
    console.log("updateItem");
    ReactDOM.render(
      React.createElement(TapSliderItem, {child: this.children[key], className:''}),
      document.getElementById(this.newItemId)
    );
  }

  slide(axis, newComponentKey){
      this.axis = axis;
      this.activateTransition=true;
      this.pointerEvents= 'none';

      this.changeDynamicHeight(0);

      if(this.axis==='-x'){
        this.addItem(newComponentKey);
        this.changeDynamicWidth(parseInt(this.sliderInitialWidth)*2);
        this.sliderLeft = '100%';
        this.SliderFloat = 'right';
      }
      else if(this.axis==='x'){
        this.addItem(newComponentKey);
        console.log('initial width ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderInitialWidth);
        console.log('dynamic width ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderDynamicWidth);
        this.changeDynamicWidth(parseInt(this.sliderInitialWidth)*2);
        console.log('dynamic width ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderDynamicWidth);
        this.sliderLeft = '-100%'
        this.SliderFloat = 'left'
      }
      if(this.axis==='y'){
        this.addItem(newComponentKey);
        console.log('initial height ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderInitialHeight);
        console.log('dynamic height ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderDynamicHeight);
        this.changeDynamicHeight(parseInt(this.sliderInitialHeight));
        console.log('dynamic height ^^^^^^^^^^^^^^^^^^^^^^^^', this.sliderDynamicHeight);
        this.sliderTop = '-100%';
      }
      else if(this.axis==='-y'){
        this.addItem(newComponentKey);
        this.changeDynamicHeight(parseInt(this.sliderInitialHeight)*2);
        this.sliderTop = '100%';
        this.transform = 'translateY(-50%)';
      }
      setTimeout(
          function() {
            if(this.axis==='-x'){
              document.getElementById('tapAwesomeDynamicSlides').removeChild(document.getElementById('tapAwesomeDynamicSlides').getElementsByClassName('tapAwesomeItem')[1]);
            }
            else if(this.axis==='x'){
              document.getElementById('tapAwesomeDynamicSlides').removeChild(document.getElementById('tapAwesomeDynamicSlides').getElementsByClassName('tapAwesomeItem')[0]);
            }
            if(this.axis==='y'){
              document.getElementById('tapAwesomeDynamicSlides').removeChild(document.getElementById('tapAwesomeDynamicSlides').getElementsByClassName('tapAwesomeItem')[0]);
            }
            else if(this.axis==='-y'){
              document.getElementById('tapAwesomeDynamicSlides').removeChild(document.getElementById('tapAwesomeDynamicSlides').getElementsByClassName('tapAwesomeItem')[1]);
            }

            if(this.axis==='x'||this.axis==='-x'){this.changeDynamicWidth( this.sliderInitialWidth )}
            if(this.axis==='y'||this.axis==='-y'){this.changeDynamicHeight( this.sliderInitialHeight )}


            this.activateTransition=false;
            this.sliderLeft = '0';
            this.sliderTop = '0';
            this.transform = '';
            this.pointerEvents = '';

            if (this.animationStatusFunction) {
              this.animationStatusFunction()
            }

          }
          .bind(this),
          this.animationDuration
      );
    }
  }

  decorate(TapSliderStore, {
      // children: observable,
      sliderItems: observable,
      temporeryItemKey : observable,
      currentItemKey : observable,
      sliderInitialWidth :observable,
      sliderInitialHeight :observable,
      sliderDynamicWidth :observable,
      sliderDynamicHeight :observable,
      sliderLeft: observable,
      sliderTop: observable,
      activateTransition: observable,
      axis: observable,
      SliderFloat: observable,
      transform: observable,
      pointerEvents: observable,
      animationDuration: observable,
      animationStatus: observable,
  })

let store = new TapSliderStore();
export default store;
