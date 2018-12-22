import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import CardsForm from './CardsForm';
import TapButton from './TapButton';

class SaveCard extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  handleSaveCard(){
    console.log('HI');
  }

  render() {
    let store = this.props.store;

    return (
      <React.Fragment>
          <div style={{width: '100%', marginTop: '1px'}}>
              <CardsForm ref="paymentForm" store={store}/>
              <div style={{height: '86px', position:'relative'}}>
                <TapButton
                    id="tap-save-btn"
                    dir={store.uIStore.getDir}
                    width="90%"
                    height="44px"
                    btnColor={'#2ACE00'}
                    active={store.uIStore.payBtn}
                    animate={this.props.store.uIStore.getBtnLoaderStatus}
                    handleClick={this.handleSaveCard.bind(this)}>Save Card</TapButton>
              </div>
          </div>
      </React.Fragment>);
  }
}

export default observer(SaveCard);
