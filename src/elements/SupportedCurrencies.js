import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Img from './Img';
import Separator from './Separator';
import Search from './Search';
import gatewayStore from '../Store/GatewayStore.js';
import mainStore from '../Store/MainStore.js';
import leftArrow from '../assets/imgs/leftArrow.svg';
import rightArrow from '../assets/imgs/rightArrow.svg';
import searchIcon from '../assets/imgs/search.svg';
import Message from './Message';

class SupportedCurrencies extends Component {

  constructor(props){
    super(props);

    this.state = {
       currenciesList:[],
       items: []
     }
  }

  componentWillMount(){
      this.setState({
         currenciesList: gatewayStore.getSupportedCurrencies,
         items: gatewayStore.getSupportedCurrencies
      });
  }

  handleClick = (current) => {

      gatewayStore.setCurrentCurrency(current);

      gatewayStore.setActivePage(0);
      gatewayStore.getIsMobile ? gatewayStore.setSubPage(0) : gatewayStore.setSubPage(-1);
  }

  filterList(event){
    console.log('e', event.target.value.toLowerCase());
      var updatedList = this.state.currenciesList;
      updatedList = updatedList.filter(function(item){

        return item.currency.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({items: updatedList});
  }

  render() {
    var self = this;


      const lightView = this.state.items.map((currency, index) =>
        <div key={'div-'+index}>
          <Row
            id={index}
            key={index}
            dir={gatewayStore.getDir}
            style={{'rowContainer': {width: '100%', backgroundColor: 'white', height: '44px'}, 'textStyle': {width: '100%'}}}
            rowTitle={{'secondary': currency.symbol + ' - ' + currency.name}}
            onClick={this.handleClick.bind(this, currency)}
            addArrow={false}
            value={currency.symbol +' '+ currency.amount}/>

            <Separator key={'separator-'+index}/>
        </div>
      );

      const darkView = this.state.items.map((currency, index) =>
          <Row
            id={index}
            key={index}
            dir={gatewayStore.getDir}
            style={{
              'rowContainer': {width: '100%', height: '40px',justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#454545'
              }},
              'textStyle': {color: 'white', margin: '0'},
              'iconStyle': {padding:'0 6px'}
            }}
            rowTitle={{'secondary': currency.currency}}
            rowIcon={<img src={currency.flag} width="27"/>}
            onClick={this.handleClick.bind(this, currency)}
            addArrow={false}
            />
      );

      return (
        <div className="supported_currencies" style={this.props.theme === 'inline' ? {background: 'transparent'} : {background: 'rgba(0,0,0,0.25)'}}>
          {this.props.theme === 'inline'?
              <div>
              <Separator />
              <Row
                dir={gatewayStore.getDir}
                style={{'rowContainer': {height:'48px', backgroundColor: 'white'}, 'textStyle': {width: '100%', textAlign: gatewayStore.getDir === 'ltr' ? 'left' : 'right'}}}
                rowIcon={<Img imgSrc={gatewayStore.getDir === 'ltr'? leftArrow : rightArrow} imgWidth="7"/>}
                rowTitle={{'secondary': 'Select Currency'}}
                onClick={this.handleClick.bind(this, gatewayStore.getCurrentCurrency)}/>
              <Separator />

              </div>
            : null }

             {this.props.theme === 'inline'?
                <div>
                  <Search
                    id="searchbar"
                    dir={gatewayStore.getDir}
                    style={{'searchContainer': {width: this.props.width}}}
                    searchIcon={<img src={searchIcon} width="13"/>}
                    searchPlaceholderText={'Search'}
                    filterList={this.filterList.bind(this)}/>
                  <div className="list-container"> <Separator />{lightView} </div>
                </div>
             :
               <div>
                 <Search
                   id="searchbar"
                   dir={gatewayStore.getDir}
                   style={{'searchContainer': {width: this.props.width}, 'searchbar': {color: 'white', border: '1px solid #777578',backgroundColor: 'rgba(0,0,0,0.20)'}}}
                   searchIcon={<img src={searchIcon} width="13"/>}
                   searchPlaceholderText={'Search'}
                   filterList={this.filterList.bind(this)}/>
                 <div className='list-container' style={{direction: gatewayStore.getDir}}>
                    {darkView}
                    </div>
                </div>
              }

        </div>
      );


  }

}

export default observer(SupportedCurrencies);
