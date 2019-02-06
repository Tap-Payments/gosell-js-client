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

      var options = this.props.options ? this.props.options.map(function(option, index){
        return(<div className="tap-option" key={index} onClick={option.action}>
              {option.title}
            </div>);
      }) : null;

      return(
        <div dir={this.props.dir} className={this.state.show ? 'notification_bar notification_true' : 'notification_bar notification_false'} style={Object.assign({}, this.state.modeStyle, this.props.style)}>

            {this.props.options ? <div className="tap-options" style={this.props.dir == 'rtl' ? {textAlign: 'left', left: '0'} : {textAlign: 'right', right: '0'}}>
              {options}
              </div>
            : <a className="close" onClick={this.handleClose.bind(this)} title="close" style={this.props.dir == 'rtl' ? {left: '0'} : {right: '0'}}>×</a>}

            <div className="notification_title" style={this.props.options ? {display: 'flex', textAlign: this.props.dir == 'rtl' ? 'right' : 'left'} : {}} onClick={this.props.onClick}>
              {this.props.children}
            </div>
        </div>
        );
  }
}

export default NotificationBar;
