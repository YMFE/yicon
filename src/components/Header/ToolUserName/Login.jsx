import React, { Component } from 'react';
import { autobind } from 'core-decorators';

import { simpleParse } from '../../../helpers/utils';

class LoginButton extends Component {
  qualifyUrl() {
    const url = '/api/login';
    const { protocol, host, pathname } = location;
    const prefix = /^\//.test(url) ? '' : pathname.match(/.*\//);

    return encodeURIComponent(`${protocol}//${host}${prefix}${url}`);
  }

  @autobind
  redirectUrl() {
    const authServiceUrl = window.__AUTH.AUTH_URL;
    const rUrl = this.qualifyUrl();
    location.href = simpleParse(authServiceUrl, { service: rUrl });
  }

  render() {
    return (
      <a className="nologin" onClick={this.redirectUrl}>
        <i className="iconfont">&#xf50e;</i>登录
      </a>
    );
  }
}

export default LoginButton;
