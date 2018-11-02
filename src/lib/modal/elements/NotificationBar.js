import React, {Component} from 'react';
import '../assets/css/styles.css';

class NotificationBar extends Component{

  constructor(props){
      super(props);
      this.state = {
        modeStyle: null,
        show: this.props.show ? true : false
      }

      this.handleClose = this.handleClose.bind(this);
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

  handleClose(props){
    this.setState({
      show: false
    });
  }

  render(){

      return(
        <div dir={this.props.dir} className={'notification_bar notification_'+this.state.show} style={Object.assign({}, this.state.modeStyle, this.props.style)}>
            <a className="close" onClick={this.handleClose} title="close" style={this.props.dir == 'rtl' ? {left: '0'} : {right: '0'}}>×</a>
            <p className="notification_title" style={this.props.onClick? {cursor: 'pointer'} : null} onClick={this.props.onClick}>{this.props.children}</p>
        </div>
        );
  }
}

export default NotificationBar;
