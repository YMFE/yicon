import React, { Component, PropTypes } from 'react';
import './Transition.scss';
export default class Transition extends Component {
  static propTypes = {
    params: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const { type } = this.props.params;
    const noLoginHTML = (
      <div>
        <div className="no-auth-tips">这是一个需要登录的页面，请你手动点一下登录进行登录</div>
        <div className="no-auth-tools">
          <a className="no-auth-login" href="#">登录</a>
        </div>
      </div>
    );
    return (
      <div>
        <div className="no-auth">
          <div className="no-auth-logo"></div>
          {type === 'no-auth' && <div className="no-auth-tips">你没有权限访问这个页面5秒后将跳转至首页</div>}
          {type === 'no-login' && noLoginHTML}
        </div>
      </div>
    );
  }
}
