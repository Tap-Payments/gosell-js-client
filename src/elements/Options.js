import React, { Component }  from 'react';
import {observer} from 'mobx-react';
import Row from './Row';
import Label from './Label';
import Img from './Img';
import Separator from './Separator';
import Cards from './Cards';
import SaveForm from './SaveForm';
import Paths from '../../webpack/paths';
import TapButton from './TapButton';
import Items from './Items/Items';
import ReactDOM from "react-dom";

const styles = {
    'row1':{
      'rowContainer': {
         height: '65px',
         backgroundColor: 'white',
        '&:hover': {
        //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
        }
    },
      'textStyle': { textAlign: 'center'},
      'iconStyle': {width: '65px', height: '65px'}
    },
    'row2':{
      'rowContainer': { backgroundColor: 'white',
      '&:hover': {
      //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
      }
    },
      'iconStyle': {width: '65px', height: '48px'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '15px',
        lineHeight: '48px',
        margin: '0px 82px'
      }
    },
    'order_row':{
      'rowContainer': { backgroundColor: 'white',
      textAlign: 'center',
      height: '30px',
      '&:hover': {
      //    boxShadow: 'inset 0px 11px 0px -10px #2ACE00, inset 0px -11px 0px -10px #2ACE00'
      }
    },
      // 'iconStyle': {width: '100px', height: '30px'},
      'textStyle': {width: '100%'},
      'subtitle':{
        fontSize: '12px'
      }
    }
}

class Options extends Component {

  constructor(props){
    super(props);

    this.state = {
      payment: null,
      height: 0
    }
  }

  handleWebClick(payment){
    this.setState({
      payment: payment
    });

    this.props.store.actionStore.onWebPaymentClick(payment);
  }

  componentDidMount(){

      console.log('Height didMount', this.props.store.uIStore.mainHeight);

      this.props.store.uIStore.calcElementsHeight('gosell-gateway-payment-options');
      // this.paymentOptions.style.height = this.props.store.uIStore.mainHeight;
  }

  componentDidUpdate(nextProps){
    if(this.props.store.uIStore.mainHeight == 0 && document.getElementById('gosell-gateway-payment-options') ){
      this.props.store.uIStore.calcElementsHeight('gosell-gateway-payment-options');
      console.log('Height didupdate', this.props.store.uIStore.mainHeight);
    }

    // this.paymentOptions.style.height = this.props.store.uIStore.mainHeight;
  }

  render() {

    var store = this.props.store;

    const WebPayments = store.paymentStore.getWebPaymentsByCurrency.map((payment, index) =>

        <div key={'div-'+index}>
            <Row
              key={payment.id}
              dir={store.uIStore.getDir}
              style={styles.row2}
              rowIcon={<Img imgSrc={payment.image} imgWidth="30" imgHeight="34" style={{padding: '6px 20px'}}/>}
              rowTitle={{'secondary': payment.name}}
              onClick={this.handleWebClick.bind(this, payment)}
              addArrow={true}/>

           <Separator key={'separator-'+index}/>
        </div>
    );


    if(store.paymentStore.customer_cards_by_currency){
        const CardsList = store.paymentStore.customer_cards_by_currency.map((payment, index) =>
            <div key={'div-'+index}>
                <Img imgSrc={payment.image} imgWidth="30"/>
            </div>
        );
    }


    return (

        <React.Fragment>
            <div id="gosell-gateway-order-details" ref={el => (this.orderDetails = el)} className="gosell-gateway-order-details">
                <div style={{height: 'fit-content'}}>
                  <Items
                    desc={store.configStore.tranx_description}
                    items={store.configStore.items}
                    total={store.configStore.order.symbol + store.uIStore.formatNumber(store.configStore.order.amount.toFixed(store.configStore.order.decimal_digit))}/>
                </div>
            </div>
            <div
              id="gosell-gateway-payment-options"
              style={{height: this.props.store.uIStore.mainHeight}}
              ref={el => (this.paymentOptions = el)}
              className="gosell-gateway-payment-options">
              <Separator />

              {store.paymentStore.supported_currencies && store.paymentStore.supported_currencies.length > 1 ?
              <Row
                id="currencies"
                ref={(node) => this.currencies = node}
                dir={store.uIStore.getDir}
                style={styles.row1}
                rowIcon={<Img imgSrc={Paths.imgsPath + 'bill.svg'} imgWidth="18" style={
                  store.uIStore.getDir === 'ltr' ?
                  {borderRight: '0.5px solid rgba(0, 0, 0, 0.17)' , padding: '21px 23px'}
                   : {borderLeft: '0.5px solid rgba(0, 0, 0, 0.17)', padding: '21px 23px'}}/>}
                rowTitle={this.props.store.paymentStore.getCurrentValue}
                onClick={this.props.store.actionStore.currenciesHandleClick}
                addArrow={true}/>
              :
              <Row
                id="currencies"
                ref={(node) => this.currencies = node}
                dir={store.uIStore.getDir}
                style={styles.row1}
                rowTitle={this.props.store.paymentStore.getCurrentValue}
                onClick={this.props.store.actionStore.currenciesHandleClick}
                addArrow={false}/>
              }
              <Separator />

              {store.paymentStore.customer_cards_by_currency && store.paymentStore.customer_cards_by_currency.length > 0 ?
                  <Cards ref="cards" store={store} cards={store.paymentStore.customer_cards_by_currency} dir={store.uIStore.getDir}/>
              : null}

              {WebPayments.length > 0 || store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                <Label title="Others" dir={store.uIStore.getDir}/>
              : <div style={{paddingBottom: '20px'}}></div>}

              {WebPayments.length > 0 ?
                <div style={{paddingBottom: '20px'}}>
                  <Separator />
                  {WebPayments}
                </div>
              : null }

              {store.paymentStore.getCardPaymentsByCurrency.length > 0 ?
                <React.Fragment>
                  <Separator />
                    <SaveForm store={store}/>
                  <Separator />
                </React.Fragment>
              : null }

            </div>

          </React.Fragment>

    );
  }
}

export default observer(Options);
