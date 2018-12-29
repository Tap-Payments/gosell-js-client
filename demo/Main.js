import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {
    render(){
        return (
          <div>
            <h1>goSell Demos</h1>
            <ul>
              <li>
                <Link to="/demo">LightBox & Elements</Link>
              </li>
              <li>
                <Link to="/gateway">Payment Gateway as a Page</Link>
              </li>
            </ul>
        </div>);
    }
}

export default Main;
