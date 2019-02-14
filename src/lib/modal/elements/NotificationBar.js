import React, {Component} from 'react';
import '../assets/css/styles.css';

class NotificationBar extends Component{

  constructor(props){
      super(props);
      this.state = {
        modeStyle: null,
        show: this.props.show ? true : false
      }
  }

  componentWillMount(){

    if(this.props.mode === 'success')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#2ACE00',
          color: '#fff'
        }
      });
    }
    else if(this.props.mode === 'error')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#E12131',
          color: '#fff'
        }
      });
    }
    else if(this.props.mode === 'warning')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#ffbf00',
          color: '#fff'
        }
      });
    }
    else if(this.props.mode === 'info')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#009AFF',
          color: '#fff'
        }
      });
    }
  }

  componentWillReceiveProps(nextProps){

    this.setState({
      show: nextProps.show
    });

    if(nextProps.mode === 'success')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#2ACE00',
          color: '#fff'
        }
      });
    }
    else if(nextProps.mode === 'error')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#E12131',
          color: '#fff'
        }
      });
    }
    else if(nextProps.mode === 'warning')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#ffbf00',
          color: '#fff'
        }
      });
    }
    else if(nextProps.mode === 'info')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#009AFF',
          color: '#fff'
        }
      });
    }
  }

  handleClose(){
    this.setState({
      show: false
    });
    this.props.close ? this.props.close() : null;
  }

  render(){
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

      var options = this.props.options ? this.props.options.map(function(option, index){
        return(<div className="tap-payments-option" key={index} onClick={option.action}>
              {option.title === "×" ? <a style={isFirefox ? {paddingTop:'19px'} : {color:''}} className="tap-payments-close">{option.title}</a> : option.title}
            </div>);
      }) : null;

      return(
        <div dir={this.props.dir} className={this.state.show ? 'tap-payments-notification-bar tap-payments-notification-true' : 'tap-payments-notification-bar tap-payments-notification-false'} style={Object.assign({}, this.state.modeStyle, this.props.style)}>

            {this.props.options ? <div className="tap-payments-options" style={this.props.dir == 'rtl' ? {textAlign: 'left', left: '0'} : {textAlign: 'right', right: '0'}}>
              {options}
              </div>
            : <a className="tap-payments-close" onClick={this.handleClose.bind(this)} title="close" style={this.props.dir == 'rtl' ? {left: '0'} : {right: '0'}}>{this.props.children ? "×" : ""}</a>}

            <div className="tap-payments-notification-title" style={this.props.options ? {display: 'flex', textAlign: this.props.dir == 'rtl' ? 'right' : 'left'} : {}} onClick={this.props.onClick}>
              {this.props.children}
            </div>
        </div>
        );
  }
}

export default NotificationBar;
