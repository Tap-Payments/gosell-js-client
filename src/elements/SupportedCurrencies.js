import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Img from './Img';
import Separator from './Separator';
import Search from './Search';
import Paths from '../../webpack/paths';
import styled from "styled-components";
// import leftArrow from '../assets/imgs/leftArrow.svg';
// import rightArrow from '../assets/imgs/rightArrow.svg';
// import searchIcon from '../assets/imgs/search.svg';

class SupportedCurrencies extends Component {

  constructor(props){
    super(props);

    this.state = {
       currenciesList:[],
       items: []
     }

     this.filter = this.filter.bind(this)
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
      this.props.store.uIStore.mainHeight = 0;

      if(this.props.store.uIStore.getIsMobile){
         // this.props.store.uIStore.setSubPage(0);
         this.props.store.uIStore.setPageIndex(0, 'x');
      }
      else {
        this.props.store.uIStore.setSubPage(-1);
      }
  }

  filter(event){

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

    var mobileView = this.state.items.map((currency, index) =>
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

      var lightView = this.state.items.map((currency, index) =>
            <Row
              id={index}
              key={index}
              dir={this.props.dir}
              style={{
                'rowContainer': {width: '100%', height: '40px',justifyContent: 'center',
                '&:hover': {
                  backgroundColor: '#fff'
                }},
                'textStyle': {color: '#474747', margin: '0'},
                'iconStyle': {padding:'0 6px'}
              }}
              rowTitle={{'secondary': currency.currency}}
              rowIcon={<img src={currency.flag} width="27"/>}
              onClick={this.handleClick.bind(this, currency)}
              addArrow={false}
              />
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


      var bg = 'transparent';
      bg = 'rgba(255, 255, 255, 0.6)';

      // this.props.store.uIStore.modal_mode === 'page' ? bg = 'rgba(255, 255, 255, 0.5)' :  bg = 'rgba(0,0,0,0.30)';

      const Currencies = styled.div`
          height: 100%;
          margin-bottom: -4px;
          overflow: hidden;
          background: ${bg};
      `

      const Effect = styled.div`
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: -9;
        bottom: 0;
        filter: blur(8px);
        -webkit-filter: blur(8px);
      `

      return (
        <Currencies>

          {this.props.theme === 'inline'?
              <div>
              <Separator />
              <Row
                dir={this.props.dir}
                style={{'rowContainer': {height:'48px', backgroundColor: 'white'}, 'iconStyle':{width: '45px'}, 'textStyle': {width: '100%', margin:'0', textAlign: this.props.dir === 'ltr' ? 'left' : 'right'}}}
                rowIcon={<Img imgSrc={this.props.dir === 'ltr'? Paths.imgsPath + 'leftArrow.svg' : Paths.imgsPath +  'rightArrow.svg' } imgWidth="7"/>}
                rowTitle={{'secondary': 'Select Currency'}}
                onClick={this.handleClick.bind(this, this.props.store.paymentStore.current_currency)}/>
              <Separator />

              </div>
            : null }

             {this.props.theme === 'inline'?
                <div>
                  {
                    // <Search
                    //   id="searchbar"
                    //   dir={this.props.dir}
                    //   style={{'searchContainer': {width: this.props.width, height: '50px'}, 'searchbar': {border:'1px solid #E1E1E1'}}}
                    //   searchIcon={<img src={Paths.imgsPath + 'search.svg'} width="13"/>}
                    //   searchPlaceholderText={'Search'}
                    //   filterList={this.filter}/>
                  }

                  <div className="list-container">{mobileView} </div>
                </div>
             :
             <div>
                 {
                   // <Search
                   //   id="searchbar"
                   //   dir={this.props.dir}
                   //   style={{'searchContainer': {width: this.props.width,padding: '5px'}, 'searchbar': {color: '#474747', border: '1px solid #f7f7f7',backgroundColor: 'rgba(255, 255, 255, 0.2)'}}}
                   //   searchIcon={<img src={Paths.imgsPath + 'search.svg'} width="13"/>}
                   //   searchPlaceholderText={'Search'}
                   //   filterList={this.filter}/>
                 }

                  <div className='list-container' style={{direction: this.props.dir}}>
                    {lightView}
                  </div>

                  <Effect />
              </div>

              }
        </Currencies>
      );
  }

}

// this.props.store.uIStore.modal_mode === 'page' ?
//   <div>
//   {
//     // <Search
//     //   id="searchbar"
//     //   dir={this.props.dir}
//     //   style={{'searchContainer': {width: this.props.width,padding: '5px'}, 'searchbar': {color: '#474747', border: '1px solid #fff',backgroundColor: 'rgba(255, 255, 255, 0.2)'}}}
//     //   searchIcon={<img src={Paths.imgsPath + 'search.svg'} width="13"/>}
//     //   searchPlaceholderText={'Search'}
//     //   filterList={this.filterList.bind(this)}/>
//   }
//
//     <div className='list-container' style={{direction: this.props.dir}}>
//        {lightView}
//        </div>
//    </div>
//
//  :
//
//  <div>
//    {
//    // <Search
//    //   id="searchbar"
//    //   dir={this.props.dir}
//    //   style={{'searchContainer': {width: this.props.width,padding: '5px'}, 'searchbar': {color: 'white', border: '1px solid #777578',backgroundColor: 'rgba(0,0,0,0.20)'}}}
//    //   searchIcon={<img src={Paths.imgsPath + 'search.svg'} width="13"/>}
//    //   searchPlaceholderText={'Search'}
//    //   filterList={this.filterList.bind(this)}/>
//  }
//    <div className='list-container' style={{direction: this.props.dir}}>
//       {lightView}
//       </div>
//   </div>
//


export default observer(SupportedCurrencies);
