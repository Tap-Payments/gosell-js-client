import "@babel/polyfill/noConflict"
import React from "react"
import { parse as ParseURL } from "query-string"
import ReactDOM from "react-dom"
import GoSell from "./elements/GoSell.js"
import GoSellElements from "./elements/GoSellElements.js"

const config = (object) => {
  var elementExists = document.getElementById("gosell-js-lib")

  if (!object.containerID && elementExists) {
    object.containerID = "gosell-js-lib"
  } else if (!elementExists && object.containerID == null && document.getElementById("gosell-gateway") == null) {
    var container = document.createElement("div")
    container.setAttribute("id", "gosell-js-lib")

    document.body.insertBefore(container, document.body.childNodes[0])

    object.containerID = "gosell-js-lib"
  }

  ReactDOM.render(<GoSell />, document.getElementById(object.containerID))

  GoSell.config(object)
}

const openLightBox = () => {
  GoSell.openLightBox()
}

const openPaymentPage = () => {
  //this option only for charge & authorize cases
  //The function calls create charge or Authorize API
  GoSell.openPaymentPage()
}

const showResult = (object) => {
  var urlParams = ParseURL(window.location.search)

  if (urlParams.tap_id) {
    if (document.getElementById("gosell-gateway") == null) {
      var container = document.createElement("div")
      container.setAttribute("id", "gosell-js-lib")

      document.body.insertBefore(container, document.body.childNodes[0])

      if (object && object.callback) {
        ReactDOM.render(<GoSell callback={object.callback} />, document.getElementById("gosell-js-lib"))
      } else {
        ReactDOM.render(<GoSell />, document.getElementById("gosell-js-lib"))
      }
    }
  }
}

const goSellElements = (object) => {
  ReactDOM.render(<GoSellElements gateway={object.gateway} transaction={{ mode: "token" }} />, document.getElementById(object.containerID))
}

const submit = () => {
  GoSellElements.submit()
}

// for NPM
export { config, GoSell, GoSellElements, openLightBox, openPaymentPage, showResult, goSellElements, submit }

// for browser
window.goSell = {
  config,
  GoSell,
  GoSellElements,
  openLightBox,
  openPaymentPage,
  showResult,
  goSellElements,
  submit
}
