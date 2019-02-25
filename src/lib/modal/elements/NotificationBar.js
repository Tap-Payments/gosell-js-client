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

    // let mainHeight = document.getElementsByClassName("tap-payments-notification-title")[0].clientHeight;
    //
    // console.log('% notification title height: ', document.getElementsByClassName("tap-payments-notification-title")[0]);
    //
    // mainHeight = mainHeight > 40 ? mainHeight : 40;
    //
    // console.log('% notification title height final: ', mainHeight);

    if(nextProps.mode === 'success')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#2ACE00',
          color: '#fff',
          // height:mainHeight
        }
      });
    }
    else if(nextProps.mode === 'error')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#E12131',
          color: '#fff',
          // height:mainHeight
        }
      });
    }
    else if(nextProps.mode === 'warning')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#ffbf00',
          color: '#fff',
          // height:mainHeight
        }
      });
    }
    else if(nextProps.mode === 'info')
    {
      this.setState({
        modeStyle: {
          backgroundColor: '#009AFF',
          color: '#fff',
          // height:mainHeight
        }
      });
    }

    this.setState({
      show: nextProps.show
    });
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
              {option.title === "×" ? <a className="tap-payments-close">{option.title}</a> : option.title}
            </div>);
      }) : null;

      return(
        <table
          dir={this.props.dir}
          className={this.state.show ? 'tap-payments-notification-bar tap-payments-notification-true' : 'tap-payments-notification-bar tap-payments-notification-false'}
          style={Object.assign({}, this.state.modeStyle, this.props.style)}>
            <tbody>
              <tr>
                <td
                  align={this.props.dir == 'rtl' ? 'right' : 'left'}
                  className={this.props.options?"tap-payments-notification-title":"tap-payments-notification-title tap-payments-notification-title-centered"}
                  onClick={this.props.onClick}>
                  <div style={{ textAlign: this.props.dir == 'rtl' ? 'right' : 'left'}}>{this.props.children}</div>
                </td>
                <td
                align={this.props.dir == 'rtl' ? 'left' : 'right'}
                className={this.props.options?"tap-payments-options":"tap-payments-options tap-payments-options-close-only"}>
                  {this.props.options ? options :
                    <a className="tap-payments-close" onClick={this.handleClose.bind(this)} title="close">{this.props.children ? "×" : ""}</a>}
                </td>
              </tr>
            </tbody>
        </table>
        );
  }
}

export default NotificationBar;
