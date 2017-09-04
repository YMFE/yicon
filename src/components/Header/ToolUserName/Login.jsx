import React, { Component } from 'react';

import redirectToLogin from '../../../helpers/login';

class LoginButton extends Component {

  render() {
    return (
      <a className="nologin" onClick={redirectToLogin}>
        <i className="iconfont">&#xf50e;</i>登录
      </a>
    );
  }
}

export default LoginButton;
