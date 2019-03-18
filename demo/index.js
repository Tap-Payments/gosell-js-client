import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";
import GoSellPaymentGateway from './GoSellPaymentGateway';
import OpenLightBox from './OpenLightBox';
import OpenPaymentPage from './OpenPaymentPage';
import GoSellDemo from './GoSellDemo';
import GoSellElementsDemo from './GoSellElementsDemo';
import Main from './Main';

ReactDOM.render(
  <HashRouter>
    <div>
      <Route exact path="/" component={Main} />
      <Route path="/open-light-box-demo" component={OpenLightBox} />
      <Route path="/open-page-demo" component={OpenPaymentPage} />
      <Route path="/gateway" component={GoSellPaymentGateway} />
      <Route path="/demo" component={GoSellDemo} />
      <Route path="/elements-demo" component={GoSellElementsDemo} />
    </div>
  </HashRouter>, document.getElementById('root'));
