import React, { Component }  from 'react';
import '../assets/css/search.css';

class Search extends Component {

  constructor(props){
    super(props);

    this.state = {
      EventType: this.props.EventType ? this.props.EventType : 'keypress'
    }

    // this.filterHandler = this.filterHandler.bind(this);
  }

  filterHandler(event){
    event.preventDefault();

    this.props.filterList(event);
  }

  render() {

    return (
      <div className="gosell-gateway-search-container" dir={this.props.dir} style={this.props.style ? this.props.style.searchContainer : null}>
              <input
                type="text"
                id={this.props.id}
                className="gosell-gateway-search-bar"
                placeholder={this.props.searchPlaceholderText}
                style={this.props.style ? this.props.style.searchbar : null}
                onKeyUp={this.filterHandler.bind(this)}
              />
              <span className={"gosell-gateway-input-icon"}>{this.props.searchIcon} </span>
      </div>
    );
  }
}

export default Search;
