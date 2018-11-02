
## Table of Contents
- [Brief Description](#brief-description)
- [Installation](#installation)
- [Usage](#usage)
- [Modal Accessories](#modal-accessories)
- [Modal Properties](#modal-properties)
- [Header Properties](#header-properties)
- [Button Properties](#button-properties)
- [Notification Bar Properties](#notification-bar-properties)
- [Example](#example)


## Brief Description

Modal is a React component that display a window to force the user to interact with it. It can be used for alert or info modal.
The component includes a ready style for 2 different headers based on Tap UI design & it also allows you to add a custom header based on the requirements.

Modal is a controlled component. To use this component, you must define a button to call the modal on click action **or** a function (like componentWillMount) to change the 'open' property to true/false.

- [Demo](https://tap-payments.github.io/goWeb-modal/).
- [Component Source Code on GitHub](https://github.com/Tap-Payments/goWeb-modal).


## Installation

```
npm i @tap-payments/modal
```

## Usage

After installing the package by cmd/terminal, add the following line to your project to import the required files. The package includes Modal, Header, Button & Notification Bar components that work together to generate the required Modal. (you can import one or all components based on your target).

```
import {Modal, Button, Header, NotificationBar} from '@tap-payments/modal';
```

The Modal component includes 2 different modes:

- **'popup'** mode: can be used with control button, link ... etc as the following example:  

```
<button onClick={Modal.open('custom-modal-1')}>Open Modal 1</button>
```
> *The button/link will need only to call <b>Modal.open('#MODAL_ID')</b> inside onClick function to open the modal.*

or with auto opening feature inside a function.

```
constructor(){
  super();

  this.state = {
    openModal:false
  }
}

componentWillMount(){
  this.setState({
      openModal: true
  })
}

<Modal id="custom-modal-0"
  close="closeInOut"
  closeIcon={clearIcon}
  open={this.state.openModal}
  mode={'popup'}>
     Example for auto opening Modal!
</Modal>
```

- **'page'** mode: can be used if you would like to have the same interface for a normal page.


> Each Modal **must** include identifier/ID to avoid any conflict between multiple modals in the same page/project.

```
<Modal id="custom-modal-1" dir="ltr">
     Modal dialog message will be here
</Modal>
```

## Modal Accessories

You can use the model with a custom header or contents, but also you can save your time and use a ready-made components for the header & footer based on the existing Tap UI design.  

#### - Header Component

The Header component includes 2 ready-made styles, **first style** can be used as ask modal dialogs to pop up and ask your users to either Logout, Save, Don't Save, or Cancel.

```
<Header dir="ltr"
        modalIcon={logoutIcon}
        style={{'header': {backgroundColor: '#f7f7f7'}}}
        separator={true}>Logout</Header>
```

**Second style** can be used as info modal dialog. This style may include avatar & title based on your target output.

```
<Header dir="rtl"
        avatarSrc={tapLogo}
        avatarTitle={'تاپ'}
        style={{'header': {height: '100px', backgroundColor: '#f7f7f7'}}}
        separator={false}></Header>
```

> Both styles can control the direction of contents inside header section, provide custom style, and define separator line between the header and body.

#### - Button Component

It is the design of the buttons that is used in Tap.

```
<Button style={buttonStyle} onClick={this.handleClick}>Click Me</Button>
```

#### - Notification Bar Component

The NotificationBar component has been added to notify users about success, error, warning and info messages from the system. The component can be used inside/outside Modal component.

```
<NotificationBar onClick={this.handleClick} mode="success" show={true}>Success message!!</NotificationBar>
```

## Modal Properties

| property name | Type  | Status  | Default value	 | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| id | string  | **required**  |  | Identifier for the modal dialog.  |
| dir  | string  | optional  | ltr | Define the contents direction. |
| mode  | string  | optional  | 'popup' | The mode can be: <br/><br/> - popup: can be used with control button, link ... etc or with auto opening feature inside a function. <br/><br/> - page: can be used if you would like to have the same interface for a normal page. |
| close  | string  | optional  | 'none' | Define closing mode of the popup modal, the modal can be closed in 3 different way: <br/><br/> - closeIn: close the modal by clicking on closeIcon. <br/><br/> - closeOut:close the modal by clicking outside the modal. <br/><br/> - closeInOut: close the modal by clicking on closeIcon or outside the modal. |
| closeIcon  | img  | **required**  |  | Define suitable icon for close the modal dialog for 'closeIn' & 'closeInOut' in close mode. |
| open  | boolean  | optional  | false | You can open the modal automatically by a function |
| pageBgColor  | string  | optional  |   | You can use it for example to add white background color to the 'page' mode. |
| pageBgImg  | img  | optional  |   | You can use it for example to add custom background image to the 'page' mode. |
| pageBgStyle  | object  | optional  |   | Override the inline styles of pageBgImg |
| header  | node  | optional  | null  | The custom/ready-made header inside the modal. |
| footer  | node  | optional | null  | Can be used to add the Tap button outside the modal dialog. if you prefer to add it inside the modal, add it directly to children. |
| children  | node  | optional  | null  | Can be used, for instance, to render/add contents inside the modal.  |
| style  | object  | optional  |   | Override the inline-styles of the root element. |
| width  | int  | optional  | 400  | Override the width of modal. |
| notification  | node  | optional  |   | The custom/ready-made notification bar at the top of modal screen. |

> You can define only one notification bar for all modals in the page. by using the notification component outside the modals.

## Header Properties

| property name | Type  | Status  | Default value	 | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| modalIcon | img  | optional  |  | Define icon for the modal dialog.  |
| dir  | string  | optional  | ltr | Define the contents direction. |
| children  | string  | optional  | null  | Can be used to add title for the Header.  |
| style  | object  | optional  |   | Override the inline-styles of the root element. |
| separator  | boolean  | optional  | false  | Add a line between Header & body section of the modal dialog. |
| loader  | node  | optional  |   | Display loader in the top of modal dialog |
| avatarSrc  | img  | optional  |   | Display an image in the middle of the Header, it can be used for info modal dialogs. |
| avatarTitle  | string  | optional  |   | Display a title for the defined Avatar in the center of Header under avatarSrc.  |


## Button Properties

| property name | Type  | Status  | Default value	 | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| children  | string  | **required**  | null  | Used to add title inside the Button.  |
| style  | object  | optional  |   | Override the inline-styles of the root element. |
| onClick  | function  | **required**  |  | Callback function for when the button is clicked. |

## Notification Bar Properties

| property name | Type  | Status  | Default value	 | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| mode  | string  | **required**  |   | The notification mode can be: <br/><br/> - success <br/> - error  <br/>- warning <br/> - info |
| show  | boolean  | optional  | false  | Used to show the notification bar in the top of screen.  |
| children  | string  | **required**  | null  | Used to add message inside the Notification bar.  |
| style  | object  | optional  |   | Override the inline-styles of the root element. |
| onClick  | function  | optional  |  | Callback function when you click on the notification bar. |

## Example

```
import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, Header, NotificationBar} from '@tap-payments/modal';
import logoutIcon from '../assets/imgs/logoutIcon.svg';
import clearIcon from '../assets/imgs/Clear.svg';
import tapLogo from '../assets/imgs/tapLogo.png';
import bg from '../assets/imgs/background.jpg';
import '../assets/css/demo.css';

class App extends Component {

  constructor(){
    super();

    this.state = {
      openModal:false
    }
  }

  handleClick(){
    /* the action function when click on the button in modal dialog */
    alert("hello there!!! ");
  }

  componentWillMount(){
    this.setState({
        openModal: true
    })
  }

  render() {

    {/*Header style objects*/}
    var headerStyle = {
        'header': {height: '100px', backgroundColor: '#f7f7f7'},
        'avatar': {/* Custom Style for avatar */},
        'avatarContainer': {/* Custom Style for avatar container*/},
        'avatarTitle': {/* Custom Style for avatar title */}
    }

    var modalStyle = {
      'modal': {top: '50px'},
      'body': {},
      'bodyContainer': {margin: '0px 10px 0px 10px', padding: '16px 0px'}
    }

    return (
      <div className="App">

      {/*List of modals*/}

      {/*Example for auto opening modal from componentWillMount function */}
      <Modal id="custom-modal-0"
        close="closeInOut"
        closeIcon={clearIcon}
        open={this.state.openModal}
        width={600}
        style={modalStyle}
        mode={'popup'}>
           Example for auto opening Modal!
      </Modal>


      <Modal id="custom-modal-1"
        dir="ltr"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        width={500}
        style={modalStyle}
        footer={<Button onClick={this.handleClick}>Click Me</Button>}>

           Modal dialog message will be here

      </Modal>

      <Modal id="custom-modal-2"
        dir="ltr"
        open={false}
        mode={'page'}
        style={modalStyle}
        pageBgColor={'white'}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'tap'}
                style={headerStyle}
                separator={false}></Header>}>

           Modal dialog message will be here

      </Modal>

      <Modal id="custom-modal-3"
        dir="ltr"
        open={false}
        mode={'page'}
        style={modalStyle}
        pageBgImg={bg}
        pageBgStyle={{width: '100%', height:'100%', opacity: 0.9}}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'tap'}
                style={headerStyle}
                separator={false}></Header>}>

           Modal dialog message will be here

      </Modal>


      <Modal id="custom-modal-4"
        dir="ltr"
        close="closeIn"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                modalIcon={logoutIcon}
                style={{'header': {height: '50px', backgroundColor: '#f7f7f7'}}}
                separator={true}>Logout</Header>}
        footer={<Button onClick={this.handleClick}>Click Me</Button>}>
           Modal dialog message will be here
      </Modal>

      <Modal id="custom-modal-5"
      dir="rtl"
      close="closeOut"
      open={false}
      mode={'popup'}
      style={modalStyle}
      header={<Header dir="rtl"
              avatarSrc={tapLogo}
              avatarTitle={'تاپ'}
              style={headerStyle}
              separator={false}></Header>}>
              محتوى ...
      </Modal>

      <Modal id="custom-modal-6"
        dir="ltr"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'Tap'}
                style={headerStyle}
                separator={false}></Header>}>
        Modal message will be here
      </Modal>

      <Modal id="custom-modal-7"
        dir="ltr"
        close="none"
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'tap'}
                style={headerStyle}
                separator={false}></Header>}
        footer={<Button onClick={this.handleClick}>Click Me</Button>}>

           Modal dialog message will be here

      </Modal>


      <Modal id="custom-modal-8"
        dir="rtl"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="rtl"
                avatarSrc={tapLogo}
                avatarTitle={'Tap'}
                style={headerStyle}
                separator={false}></Header>}
        notification={<NotificationBar dir="rtl" onClick={this.handleClick} mode="success" show={true}>عربي! </NotificationBar>}>
          محتوى عربي!
      </Modal>

      <Modal id="custom-modal-9"
        dir="ltr"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'Tap'}
                style={headerStyle}
                separator={false}></Header>}
        notification={<NotificationBar mode="error" show={true}>Error message!!</NotificationBar>}>
          Modal message will be here
      </Modal>

      <Modal id="custom-modal-10"
        dir="ltr"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'Tap'}
                style={headerStyle}
                separator={false}></Header>}
        notification={<NotificationBar mode="warning" style={{color: 'black'}} show={true}>Warning message!!</NotificationBar>}>
          Modal message will be here
      </Modal>

      <Modal id="custom-modal-11"
        dir="ltr"
        close="closeInOut"
        closeIcon={clearIcon}
        open={false}
        mode={'popup'}
        style={modalStyle}
        header={<Header dir="ltr"
                avatarSrc={tapLogo}
                avatarTitle={'Tap'}
                style={headerStyle}
                separator={false}></Header>}
        notification={<NotificationBar mode="info" show={true}>Info message!!</NotificationBar>}>
          Modal message will be here
      </Modal>

      {/* Demo page */}
      <br/><h2>Modal Component includes the following cases: </h2>
      <br/>

      <h3>Modal Modes</h3><hr/>

      <div className="demoContainer row">
          <div className="column">
              <div className="content_container">
                  <h4>Pop Up Mode:</h4>
                  <p className="desc">You can close the modal in different ways, the mode o/f the modal "popup". </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-1')}>Pop Up Mode</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>Page Mode (color background):</h4>
                  <p className="desc">You can not close the modal, the mode o/f the modal "page". PageBgColor has been assign to white color. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-2')}>Page Mode 1</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>Page Mode (image background):</h4>
                  <p className="desc">You can not close the modal, the mode o/f the modal "page". pageBgImg has been used.</p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-3')}>Page Mode 2</button>
              </div>
          </div>

      </div>

      <br/>

      <h3>Close Modes</h3><hr/>

      <div className="demoContainer row">
          <div className="column">
              <div className="content_container">
                  <h4>CloseIn:</h4>
                  <p className="desc">You can close the modal only by clicking on close icon.</p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-4')}>CloseIn</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>CloseOut:</h4>
                  <p className="desc">You can close the modal only by clicking outside the modal. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-5')}>CloseOut</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>CloseInOut:</h4>
                  <p className="desc">You can close the modal by clicking on close icon or outside the modal. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-6')}>CloseInOut</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>None:</h4>
                  <p className="desc">You can not close the modal, the mode o/f the modal "popup". </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-7')}>None</button>
              </div>
          </div>
      </div>

      <br/>

      <h3>Notification Modes</h3><hr/>

      <div className="demoContainer row">
          <div className="column">
              <div className="content_container">
                  <h4>Success Notification:</h4>
                  <p className="desc">Success notification bar. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-8')}>Notification</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>Error Notification:</h4>
                  <p className="desc">Error notification bar. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-9')}>Notification</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>Warning Notification:</h4>
                  <p className="desc">Warning notification bar. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-10')}>Notification</button>
              </div>
          </div>
          <div className="column">
              <div className="content_container">
                  <h4>Info Notification:</h4>
                  <p className="desc">Info notification bar. </p>
                  <br />
                  <button className={'btn'} onClick={Modal.open( 'custom-modal-11')}>Notification</button>
              </div>
          </div>

      </div>


      </div>

    );
  }
}

export default App;

```

## Author

* [Hala Q.](https://www.npmjs.com/~hala.q)
