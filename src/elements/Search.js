import React, { Component }  from 'react';
import '../assets/css/search.css';

class Search extends Component {

  constructor(props){
    super(props);

    this.state = {
      EventType: this.props.EventType ? this.props.EventType : 'keypress'
    }

    this.filterHandler = this.filterHandler.bind(this);
  }

  filterHandler(e){
    this.props.filterList(e);
  }

  render() {

    return (
      <div className="tap-search-container" dir={this.props.dir} style={this.props.style ? this.props.style.searchContainer : null}>
              <input
                type="text"
                id={this.props.id}
                className="tap-searchbar"
                placeholder={this.props.searchPlaceholderText}
                style={this.props.style ? this.props.style.searchbar : null}
                onKeyUp={this.filterHandler}
              />
              <span className={"tap-input-icon"}>{this.props.searchIcon} </span>
      </div>
    );
  }
}

export default Search;
