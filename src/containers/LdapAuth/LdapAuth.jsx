import './LdapAuth.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { fetchLdapAuth } from '../../actions/ldapauth';

import Input from '../../components/common/Input/Index.jsx';

@connect(
  () => ({}),
  {
    fetchLdapAuth,
  }
)

export default class LdapAuth extends Component {
  static propTypes = {
    fetchLdapAuth: PropTypes.func,
  }

  @autobind
  doLdapAuth(e) {
    e.preventDefault();

    const username = this.refs.username.getVal();
    const password = this.refs.password.getVal();

    if (username === '' || password === '') {
      return;
    }

    this.props.fetchLdapAuth({ username, password }).then(data => {
      if (data.payload.data.isValid === true) {
        window.location.href = '/';
      } else {
        window.location.href = '/transition/ldapauth-failed';
      }
    });
  }

  render() {
    return (
      <div className="ldapauth">
        <header className="global-subtitle">
          <div className="container">
            <div className="options">
              <div className="title">
                <h2>用户登录</h2>
              </div>
            </div>
          </div>
        </header>
        <div className="global-content">
          <div className="content">
            <div className="login-area">
              <div className="icon"><i className="iconfont">&#xf50e;</i></div>
              <form onSubmit={this.doLdapAuth} className="form">
                <ul>
                  <li className="item-input">
                    <Input placeholder="用户名" ref="username" extraClass="textbox" />
                  </li>
                  <li className="item-input">
                    <Input type="password" placeholder="密码" ref="password" extraClass="textbox" />
                  </li>
                  <li className="item-btn">
                    <button type="submit" className="options-btns btns-blue button">登录</button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
