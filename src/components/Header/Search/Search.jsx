import './Search.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { push } from 'react-router-redux';

@connect(
  state => (state)
)
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  @autobind
  searchIcon(e) {
    const trim = str => str.replace(/^\s+|\s+$/g, '');
    const value = encodeURIComponent(trim(e.target.value));
    if (e.keyCode === 13) {
      this.props.dispatch(push(`/search?q=${value}`));
    }
  }

  render() {
    return (
      <li className="lists global-header-search">
        <div className="search-panel">
          <div className="search-panel-fields">
            <input
              type="text"
              defaultValue={this.props.searchValue}
              ref="input"
              className="ks-combobox-input search-q"
              placeholder="请输入图标名称/编码/标签"
              onKeyDown={this.searchIcon}
            />
          </div>
          <i id="J_SearchIcon" className="iconfont search-icon">&#xf50c;</i>
        </div>
      </li>
    );
  }
}

Search.propTypes = {
  searchValue: PropTypes.string,
  onChange: PropTypes.func,
  dispatch: PropTypes.func,
  redirectTo: PropTypes.func,
};

export default Search;
