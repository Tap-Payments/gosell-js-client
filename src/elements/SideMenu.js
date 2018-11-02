import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/css/sideMenu.css';
import gatewayStore from '../Store/GatewayStore.js';

class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = {
      delay: this.props.delay ? this.props.delay : '0'
    };
  }

  render(){

    let dir= gatewayStore.getDir;
    let expandMenu, styles, alian;
    var duration = this.props.animationDuration;

    if(dir === 'ltr'){
      styles = {right:'0px', width: this.props.width, opacity: 1}
      alian = 'right';

      expandMenu= {
        width: this.props.width,
        maxWidth: this.props.width,
        left: this.props.width,
        transition: 'all '+duration+' linear '+this.state.delay,
        opacity: 1
      }
    }
    else {
      styles = {left:'0px', width: this.props.width, opacity: 1}
      alian = 'left';

      expandMenu= {
        width: this.props.width,
        maxWidth: this.props.width,
        right: this.props.width,
        transition: 'all '+duration+' linear '+this.state.delay,
        opacity: 1
      }
    }

    return(
      <div className='tap-side-menu' style={styles}>
          <div id={alian + '-menu-background'}  style={this.props.expand ? expandMenu : {transition: 'all '+duration+' linear'}}>
              {this.props.children}
          </div>
      </div>
    );

  }
}

export default observer(SideMenu);
