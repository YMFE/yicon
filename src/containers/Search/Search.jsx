import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchSearchData } from '../../actions/search';
import Slider from '../../components/common/Slider/Slider.jsx';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

import './Search.scss';

@connect(
  state => ({
    list: state.search.data,
    totalCount: state.search.totalCount,
  }), { fetchSearchData }
)

export default class Search extends Component {
  componentWillMount() {
    this.props.fetchSearchData(this.props.location.query.q);
  }

  render() {
    return (
      <div className="yicon-main yicon-search">
        <div className="clearfix yicon-search-info">
          <div className="yicon-search-info-container">
            <div className="clearfix options">
              <div className="search-result">
                共为您找到 <em className="search-result-count">{this.props.totalCount}</em> 个结果
              </div>
              <div style={{ width: 200, padding: 10 }}><Slider /></div>
            </div>
          </div>
        </div>
        <div className="yicon-search-main">
          {
            this.props.list.map((repo) => (
              <div key={repo.id}>
                <h3 className="clearfix yicon-search-title">
                  {repo.name}图标库
                </h3>
                <div className="clearfix yicon-search-list">
                {
                  repo.icons.map((icon) => (
                    <IconButton
                      icon={icon}
                      key={icon.id}
                    />
                  ))
                }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  fetchSearchData: PropTypes.func,
  location: PropTypes.shape({
    query: PropTypes.shape({
      q: PropTypes.string.isRequired,
    }),
  }),
  totalCount: PropTypes.number,
  list: PropTypes.array,
};
