import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoSellPaymentGateway from './GoSellPaymentGateway';
import GoSellDemo from './GoSellDemo';
import Main from './Main';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" component={Main} />
      <Route path="/demo" component={GoSellDemo} />
      <Route path="/gateway" component={GoSellPaymentGateway} />
    </div>
  </Router>, document.getElementById('root'));
