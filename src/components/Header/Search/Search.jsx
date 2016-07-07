import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Popover from 'material-ui/Popover';
import Icon from '../../common/Icon/Icon.jsx';
import styles from './Search.scss';
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
    this.searchIcon = this.searchIcon.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  searchIcon(e) {
    this.props.fetchSearchResult(e.currentTarget.value);
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <div className={styles.floatStyle}>
        <input type="input" placeholder="请输入查询关键字" ref="input" onChange={this.searchIcon} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          {
            this.props.searchResult.map(icon => (
              <div key={icon.id} className={styles.icon} >
                <span>{icon.name}</span>
                <Icon size={20} d={icon.path} /><br />
              </div>
            ))
          }
        </Popover>
      </div>
    );
  }
}

Search.propTypes = {
  searchResult: PropTypes.array,
  fetchSearchResult: PropTypes.func,
};

export default Search;
