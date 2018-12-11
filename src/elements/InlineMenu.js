import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Img from './Img';
import Separator from './Separator';
import Search from './Search';
import leftArrow from '../assets/imgs/leftArrow.svg';
import rightArrow from '../assets/imgs/rightArrow.svg';
import searchIcon from '../assets/imgs/search.svg';

class InlineMenu extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {

    return (
      <div className="tap-inline-menu" style={{overflow: 'hidden'}}>
          {this.props.children}
      </div>
    );
  }

}

export default observer(InlineMenu);
