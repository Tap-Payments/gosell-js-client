import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoSellPaymentGateway from './GoSellPaymentGateway';
import OpenLightBox from './OpenLightBox';
import OpenPaymentPage from './OpenPaymentPage';
import GoSellDemo from './GoSellDemo';
import GoSellElementsDemo from './GoSellElementsDemo';
import Main from './Main';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/open-light-box-demo" component={OpenLightBox} />
      <Route path="/open-page-demo" component={OpenPaymentPage} />
      <Route exact path="/gateway" component={GoSellPaymentGateway} />
      <Route path="/demo" component={GoSellDemo} />
      <Route path="/elements-demo" component={GoSellElementsDemo} />
      <Route exact path="/" component={Main} />
    </div>
  </Router>, document.getElementById('root'));
