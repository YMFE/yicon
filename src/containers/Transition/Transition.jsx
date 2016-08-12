import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import './Transition.scss';

@connect()
export default class Transition extends Component {
  static propTypes = {
    params: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
  }

  state = {
    second: 5,
  }

  componentDidMount() {
    const { type } = this.props.params;
    if (type === 'no-auth') {
      this.backToHome();
    }
  }

  qssoLogin() {
    window.QSSO.auth('/api/login');
  }

  backToHome() {
    const intervalId = setInterval(() => {
      this.setState({
        second: this.state.second - 1,
      }, () => {
        if (this.state.second <= 0) {
          clearInterval(intervalId);
          this.props.dispatch(replace('/'));
        }
      });
    }, 1000);
  }

  render() {
    const { type } = this.props.params;
    const noLoginHTML = (
      <div>
        <div className="no-auth-tips">
          这是一个需要登录的页面，请你手动点一下登录进行登录
        </div>
        <div className="no-auth-tools">
          <button
            className="no-auth-login"
            onClick={this.qssoLogin}
          >
            登录
          </button>
        </div>
      </div>
    );

    const transHTML = (
      <div>
        <p className="no-auth-tips">你没有权限访问这个页面</p>
        <p className="no-auth-tips">{this.state.second} 秒之后跳转至首页</p>
      </div>
    );

    return (
      <div>
        <div className="no-auth">
          <div className="no-auth-logo"></div>
          {type === 'no-auth' && transHTML}
          {type === 'no-login' && noLoginHTML}
        </div>
      </div>
    );
  }
}
