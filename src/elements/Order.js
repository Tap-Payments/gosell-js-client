import React, { Component }  from 'react';
import styled from "styled-components";
import {observer} from 'mobx-react';
import Row from './Row';
import Separator from './Separator';
import Img from './Img';
import Paths from '../../webpack/paths';

class Order extends Component {

  constructor(props){
    super(props);
  }

  render() {
    var store = this.props.store;

    const Desc = styled.div`
      margin: 20px;
    `

    return (
      <div>
        <React.Fragment>
          <Separator />
          <Row
            dir={this.props.dir}
            style={{'rowContainer': {height:'48px', backgroundColor: 'white'}, 'iconStyle':{width: '45px'}, 'textStyle': {width: '100%', margin:'0', textAlign: this.props.dir === 'ltr' ? 'left' : 'right'}}}
            rowIcon={<Img imgSrc={this.props.dir === 'ltr'? Paths.imgsPath + 'leftArrow.svg' : Paths.imgsPath +  'rightArrow.svg' } imgWidth="7"/>}
            rowTitle={{'secondary': 'Back'}}
            onClick={store.actionStore.handleOrderDetailsClick}/>
          <Separator />
        </React.Fragment>

        <Desc>
          {store.configStore.tranx_description}
        </Desc>
      </div>
    );
  }
}

export default observer(Order);
