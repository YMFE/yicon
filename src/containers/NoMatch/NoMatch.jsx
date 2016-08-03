import React, { Component } from 'react';
import './NoMatch.scss';
export default class NoMatch extends Component {
  render() {
    return (
      <div className={'no-match'}>
        <div className={'no-match-logo'}></div>
        <div className={'no-match-tips'}>矮油~跑偏了~</div>
        <div className={'no-match-tools'}>
          <a className={'no-match-return'} href="#">回首页</a>
        </div>
      </div>
    );
  }
}
