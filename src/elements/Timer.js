import React, { Component }  from 'react';
import '../assets/css/timer.css';

class Timer extends React.Component {

  format(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
    seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
    return minutes + ':' + seconds;
  }

  render () {
    const {time} = this.props;
    return (
      <div className="displayedTime">
        <div className={this.props.running ? "tap-timer" : "tap-timer fadeOut"}>{this.format(time)}</div>
      </div>
    )
  }
}

export default Timer;
