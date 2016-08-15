import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import './NoMatch.scss';

@connect()
export default class NoMatch extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  @autobind
  backToHome() {
    this.props.dispatch(replace('/'));
  }

  render() {
    return (
      <div className="no-match">
        <div className="no-match-logo"></div>
        <div className="no-match-tips">矮油~跑偏了~</div>
        <div className="no-match-tools">
          <button
            onClick={this.backToHome}
            className="no-match-return"
          >
            回首页
          </button>
        </div>
      </div>
    );
  }
}
