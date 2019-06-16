import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";
import OpenLightBox from './OpenLightBox';
import GoSellDemo from './GoSellDemo';
import GoSellElementsDemo from './GoSellElementsDemo';
import Main from './Main';

ReactDOM.render(
    <HashRouter>
      <div>
      <Route exact path="/" component={Main} />
      <Route path="/open-light-box-demo" component={OpenLightBox} />
      <Route path="/demo" component={GoSellDemo} />
      <Route path="/elements-demo" component={GoSellElementsDemo} />
      </div>
    </HashRouter>, document.getElementById('root'));
