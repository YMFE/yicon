import './Search.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Icon from '../../common/Icon/Icon.jsx';
import { autobind } from 'core-decorators';
import {
  fetchSearchResult,
} from '../../../actions/search';

@connect(
  state => ({ searchResult: state.search }),
  { fetchSearchResult }
)
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  @autobind
  searchIcon(e) {
    this.props.fetchSearchResult(e.currentTarget.value);
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }

  @autobind
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <div className={"global-header-search"}>
        <input type="input" placeholder="请输入查询关键字" ref="input" onChange={this.searchIcon} />
        <div
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          {
            this.props.searchResult.map(icon => (
              <div key={icon.id} className="icon" >
                <span>{icon.name}</span>
                <Icon size={20} d={icon.path} /><br />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  searchResult: PropTypes.array,
  fetchSearchResult: PropTypes.func,
};

export default Search;
