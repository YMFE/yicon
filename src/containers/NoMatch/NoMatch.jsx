import React, { Component } from 'react';
import './NoMatch.scss';
export default class NoMatch extends Component {
  render() {
    return (
      <div className={'no-match'}>
        <div className={'no-match-logo'}></div>
        <div className={'no-match-tips'}></div>
        <div className={'no-match-tools'}>
          <a className={'no-match-return'} href="#">回首页</a>
        </div>
        <h1>这是一个 404 页面</h1>
      </div>
    );
  }
}
