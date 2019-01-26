import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Img from './Img';
import Separator from './Separator';
import Search from './Search';
import leftArrow from '../assets/imgs/leftArrow.svg';
import rightArrow from '../assets/imgs/rightArrow.svg';
import searchIcon from '../assets/imgs/search.svg';

class SupportedCurrencies extends Component {

  constructor(props){
    super(props);

    this.state = {
       currenciesList:[],
       items: []
     }
  }

  componentWillMount(){
    if(this.props.store.paymentStore.supported_currencies.length > 1){
      this.setState({
         currenciesList: this.props.store.paymentStore.supported_currencies,
         items: this.props.store.paymentStore.supported_currencies
      });
    }

  }

  handleClick = (current) => {

      this.props.store.paymentStore.setCurrentCurrency(current);

      // this.props.store.uIStore.setActivePage(0, 'x');
      // this.props.store.uIStore.getIsMobile ? this.props.store.uIStore.setSubPage(0) : this.props.store.uIStore.setSubPage(-1);

      if(this.props.store.uIStore.getIsMobile){
         // this.props.store.uIStore.setSubPage(0);
         this.props.store.uIStore.setPageIndex(0, 'x');
      }
      else {
        this.props.store.uIStore.setSubPage(-1);
      }
  }

  filterList(event){
      var updatedList = this.state.currenciesList;
      updatedList = updatedList.filter(function(item){

        return item.currency.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({items: updatedList});
  }

  render() {
    var self = this;

    console.log('supported_currencie : .............. : ', this.props.store.paymentStore.supported_currencies);

    var lightView = this.state.items.map((currency, index) =>
        <div key={'div-'+index}>
          <Row
            id={index}
            key={index}
            dir={this.props.dir}
            style={{'rowContainer': {width: '100%', backgroundColor: 'white', height: '44px'}, 'textStyle': {width: '100%'}}}
            rowTitle={{'secondary': currency.symbol + ' - ' + currency.name}}
            onClick={this.handleClick.bind(this, currency)}
            addArrow={false}
            value={currency.symbol +' '+ currency.amount}/>

            <Separator key={'separator-'+index}/>
        </div>
      );

    var darkView = this.state.items.map((currency, index) =>
          <Row
            id={index}
            key={index}
            dir={this.props.dir}
            style={{
              'rowContainer': {width: '100%', height: '40px',justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#343434'
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
        <div className="supported_currencies" style={this.props.theme === 'inline' ? {height: '100%', background: 'transparent'} : {height: '100%', background: 'rgba(0,0,0,0.30)'}}>
          {this.props.theme === 'inline'?
              <div>
              <Separator />
              <Row
                dir={this.props.dir}
                style={{'rowContainer': {height:'48px', backgroundColor: 'white'}, 'iconStyle':{width: '45px'}, 'textStyle': {width: '100%', margin:'0', textAlign: this.props.dir === 'ltr' ? 'left' : 'right'}}}
                rowIcon={<Img imgSrc={this.props.dir === 'ltr'? leftArrow : rightArrow} imgWidth="7"/>}
                rowTitle={{'secondary': 'Select Currency'}}
                onClick={this.handleClick.bind(this, this.props.store.paymentStore.current_currency)}/>
              <Separator />

              </div>
            : null }

             {this.props.theme === 'inline'?
                <div>
                  <Search
                    id="searchbar"
                    dir={this.props.dir}
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
                   dir={this.props.dir}
                   style={{'searchContainer': {width: this.props.width}, 'searchbar': {color: 'white', border: '1px solid #777578',backgroundColor: 'rgba(0,0,0,0.20)'}}}
                   searchIcon={<img src={searchIcon} width="13"/>}
                   searchPlaceholderText={'Search'}
                   filterList={this.filterList.bind(this)}/>
                 <div className='list-container' style={{direction: this.props.dir}}>
                    {darkView}
                    </div>
                </div>
              }

        </div>
      );


  }

}

export default observer(SupportedCurrencies);
