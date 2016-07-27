import React, { Component, PropTypes } from 'react';

export default class Transition extends Component {
  static propTypes = {
    params: PropTypes.object,
    type: PropTypes.string,
  };

  render() {
    const { type } = this.props.params;
    return (
      <div>
        {type === 'no-auth' && <h1>这是一个无权限跳转页面，请你手动点一下 logo 返回首页</h1>}
        {type === 'no-login' && <h1>这是一个需要登录的页面，请你手动点一下登录进行登录</h1>}
      </div>
    );
  }
}
