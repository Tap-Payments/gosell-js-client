import React, { Component }  from 'react';
import {TapGateway} from '../../src';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      open: false
    }
  }

  handleClick(){
    this.setState({
      open: true
    });
  }

  render() {

    return (
      <div className="App">
        <button onClick={this.handleClick.bind(this)}>click me</button>
        <TapGateway open={this.state.open} pk="pk_test_Rhk1acsSKdj5LYm0H8UBZVEX" data={{
          'amount':'100',
          'currency':'KWD',
          'customer':{
            'id':'cus_s5HX201898j5J91128810',
            "first_name": "test",
            "middle_name": "test",
            "last_name": "test",
            "email": "test@test.com",
            "phone": {
              "country_code": "965",
              "number": "50000000"
            }
          },
          'chg_id':'chg_x9TM20181442Yx2c3179210',
          'description': "Test Description",
          'statement_descriptor': "Sample",
          'reference': {
            'transaction': "txn_0001",
            'order': "ord_0001"
          },
          'receipt': {
            'email': false,
            'sms': true
          }
        }}
         />
      </div>

    );
  }
}


export default App;
