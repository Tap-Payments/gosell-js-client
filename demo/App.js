import React, { Component } from "react"
import { GoSell, GoSellElements } from "../src"
import { observer } from "mobx-react"

class Popup extends Component {
  state = { elements: false, checkout: true, lang: "en" }

  onChangeHandler(e) {
    if (e.target.name === "gosell-elements" && e.target.checked) {
      this.setState({
        elements: true,
        checkout: false
      })
    } else if (e.target.name === "gosell-checkout" && e.target.checked) {
      this.setState({
        elements: false,
        checkout: true
      })
    } else {
      this.setState({
        elements: false,
        checkout: false
      })
    }
  }

  changeConfig() {
    this.setState({
      lang: "ar"
    })
  }

  render() {
    return (
      <div className='App'>
        <div>
          <input type='checkbox' name='gosell-checkout' onChange={this.onChangeHandler.bind(this)} />
          goSell Checkout
        </div>

        {this.state.checkout ? (
          <React.Fragment>
            <br />
            <button onClick={GoSell.openLightBox}>LightBox Mode</button>
            <button onClick={GoSell.openPaymentPage}>Page Mode</button>
            <button onClick={this.changeConfig.bind(this)}>change lang</button>

            <GoSell
              gateway={{
                //paypal allowed
                //publicKey: "pk_test_EtHFV4BuPQokJT6jiROls87Y",
                // publicKey: "pk_test_oYJLQj6wHNytRaeF0Db5qTv8",
                publicKey: "pk_test_oYJLQj6wHNytRaeF0Db5qTv8",
                // merchant_id: "1124340",
                language: this.state.lang,
                contactInfo: false,
                supportedCurrencies: "all",
                supportedPaymentMethods: "all",
                saveCardOption: true,
                customerCards: true,
                notifications: "standard",
                callback: (response) => {
                  console.log("callback", response)
                },
                onClose: () => {
                  console.log("onclose hey")
                },
                onLoad: () => console.log("Successfully loaded"),
                style: {
                  base: {
                    color: "red",
                    lineHeight: "10px",
                    fontFamily: "sans-serif",
                    fontSmoothing: "antialiased",
                    fontSize: "10px",
                    "::placeholder": {
                      color: "rgba(0, 0, 0, 0.26)",
                      fontSize: "10px"
                    }
                  },
                  invalid: {
                    color: "red",
                    iconColor: "#fa755a "
                  }
                }
              }}
              customer={{
                first_name: "hala",
                middle_name: "",
                last_name: "",
                email: "test@test.com",
                phone: {
                  country_code: "+965",
                  number: "62221019"
                }
              }}
              order={{
                amount: 100,
                currency: "KWD",
                items: [
                  {
                    amount_per_unit: 0,
                    description: "Item Desc 0",
                    id: 0,
                    name: "Item ",
                    old_quantity: 1,
                    old_total_amount: 0,
                    quantity: 1,
                    total_amount: 100
                  }
                ],
                shipping: {
                  amount: 1,
                  currency: "USD",
                  description: "test",
                  provider: "ARAMEX",
                  service: "test"
                }
              }}
              transaction={{
                mode: "charge",
                charge: {
                  saveCard: false,
                  threeDSecure: true,
                  description: "description",
                  statement_descriptor: "statement_descriptor",
                  reference: {
                    transaction: "txn_0001",
                    order: "ord_0001"
                  },
                  metadata: {},
                  receipt: {
                    email: false,
                    sms: true
                  },
                  redirect: null,
                  post: null
                }
              }}
            />
            <br />
          </React.Fragment>
        ) : null}
        <br />
        <div>
          <input type='checkbox' name='gosell-elements' onChange={this.onChangeHandler.bind(this)} />
          goSell Elements
        </div>
        {this.state.elements ? (
          <React.Fragment>
            <br />
            <GoSellElements
              gateway={{
                //paypal allowed
                publicKey: "pk_test_EtHFV4BuPQokJT6jiROls87Y",
                // publicKey: "pk_test_Vlk842B1EA7tDN5QbrfGjYzh",
                language: "en",
                contactInfo: false,
                supportedCurrencies: "all",
                supportedPaymentMethods: "all",
                saveCardOption: true,
                customerCards: true,
                notifications: "msg",
                callback: (response) => {
                  console.log("callback", response)
                }
              }}
            />
            <div id='msg'></div>
            <button onClick={() => GoSellElements.submit()}>Submit</button>
            <br />
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}

export default observer(Popup)
