import React, { Component }  from "react";
import Store from '../../store/DemoConfigStore';
import {observer} from 'mobx-react';
import './app.css';

class CustomerSettings extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="customer-settings">
      <fieldset>
               <legend>Customer Settings:</legend>
               <div className='app-container'>
                 <label>ID: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="id"
                     value={Store.customer.id}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />
               <div className='app-container'>
                 <label>First Name: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="first_name"
                     value={Store.customer.first_name}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />
               <div className='app-container'>
                 <label>Middle Name: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="middle_name"
                     value={Store.customer.middle_name}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />
               <div className='app-container'>
                 <label>Last Name: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="last_name"
                     value={Store.customer.last_name}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />
               <div className='app-container'>
                 <label>Email: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="email"
                     value={Store.customer.email}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />
               <div className='app-container'>
                 <label>Phone Number: </label>
                 <div className='app-row'>
                   <input
                     type="text"
                     style={{width: '100%'}}
                     name="phone"
                     value={Store.customer.phone.number}
                     onChange={(value) => Store.updateCustomerObj(value)}/>
                 </div>
               </div>
               <br />

             </fieldset>
      </div>
    );
  }
}

export default observer(CustomerSettings);
