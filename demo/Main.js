import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {
  render() {
    return (
      <div>
        <h1>goSell Demos</h1>
        <ul>
          <li>
            <Link to="/open-light-box-demo">LightBox & Elements Demo</Link>
          </li>
          <li>
            <Link to="/open-page-demo">
              Open Payment Page from JS library without charge / authorize ID
              (for now, it just called the old gateway)
            </Link>
          </li>
          <li>
            <Link to="/gateway">Payment Gateway Page</Link>
          </li>
          <li>
            <Link to="/demo">GoSell Demo</Link>
          </li>
          <li>
            <Link to="/elements-demo">GoSell Elements Demo</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Main;
