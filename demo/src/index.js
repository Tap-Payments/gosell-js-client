import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import App2 from './App2';

ReactDOM.render(<App2 />, document.getElementById('root'));

// ReactDOM.render(
//   <Router>
//     <div>
//       <Route exact path="/" component={App} />
//       <Route path="/:tap_id" component={App} />
//     </div>
// </Router>, document.getElementById('root'));
