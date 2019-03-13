import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import '../assets/css/sideMenu.css';

class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = {
      delay: this.props.delay ? this.props.delay : '0'
    };
  }

  render(){

    let dir= this.props.dir;
    let expandMenu, styles, alian;
    var duration = this.props.animationDuration;

    console.log('width +++++++ ', this.props.width);

    if(dir === 'ltr'){
      styles = {right:'0px', width: this.props.width + 'px', opacity: 1}
      alian = 'right';

      expandMenu= {
        width: this.props.width + 'px',
        maxWidth: this.props.width + 'px',
        left: (this.props.width - 5) + 'px',
        transition: 'all '+duration+' linear '+this.state.delay,
        opacity: 1,
      }
    }
    else {
      styles = {left:'0px', width: this.props.width + 'px', opacity: 1}
      alian = 'left';

      expandMenu= {
        width: this.props.width + 'px',
        maxWidth: this.props.width + 'px',
        right: (this.props.width - 5) + 'px',
        transition: 'all '+duration+' linear '+this.state.delay,
        opacity: 1,
      }
    }

    return(
      <div  id="gosell-gateway-side-menu" className='gosell-gateway-side-menu' style={styles}>
          <div id={'gosell-gateway-'+alian + '-menu-background'}  style={this.props.expand ? expandMenu : {transition: 'all '+duration+' linear'}}>
              {this.props.children}
          </div>
      </div>
    );

  }
}

export default observer(SideMenu);
