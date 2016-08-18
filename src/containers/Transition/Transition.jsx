import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import './Transition.scss';

@connect()
export default class Transition extends Component {
  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
  }

  state = {
    second: 5,
  }

  componentDidMount() {
    const { type } = this.props.params;
    switch (type) {
      case 'no-auth': {
        this.backToPage('/');
        break;
      }
      case 'repl-icon': {
        const { repoId } = this.props.location.query;
        this.backToPage(`/repositories/${repoId}`);
        break;
      }
      case 'audit-icon': {
        this.backToPage('/');
        break;
      }
      case 'upload-icon': {
        this.backToPage('/upload');
        break;
      }
      default: {
        break;
      }
    }
  }

  qssoLogin() {
    window.QSSO.auth('/api/login');
  }

  intervalId = '';
  backToPage(url) {
    this.intervalId = setInterval(() => {
      this.setState({
        second: this.state.second - 1,
      }, () => {
        if (this.state.second <= 0) {
          clearInterval(this.intervalId);
          this.props.dispatch(replace(url));
        }
      });
    }, 1000);
  }

  immedBackToPage(url) {
    clearInterval(this.intervalId);
    this.props.dispatch(replace(url));
  }

  render() {
    const { type } = this.props.params;
    const { repoId } = this.props.location.query;
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

    const replIconHTML = (
      <div>
        <div className="no-auth-tips">
          <p>替换成功</p>
          <p>{this.state.second} 秒之后跳转至图标库页</p>
          <p>替换图标位于库的最后</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage(`/repositories/${repoId}`)}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    const auditIconHTML = (
      <div>
        <div className="no-auth-tips">
          <p>所有图标审核完成</p>
          <p>没有待审核图标</p>
          <p>{this.state.second} 秒之后跳转至首页</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage('/')}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    const uploadIconHTML = (
      <div>
        <div className="no-auth-tips">
          <p>所有图标上传完成</p>
          <p>没有待上传的图标</p>
          <p>{this.state.second} 秒之后跳转至图标上传页</p>
        </div>
        <p>
          <button
            className="no-auth-login"
            onClick={() => this.immedBackToPage('/upload')}
          >
            点击跳转
          </button>
        </p>
      </div>
    );

    return (
      <div>
        <div className="no-auth">
          <div className="no-auth-logo"></div>
          {type === 'no-auth' && transHTML}
          {type === 'no-login' && noLoginHTML}
          {type === 'repl-icon' && replIconHTML}
          {type === 'audit-icon' && auditIconHTML}
          {type === 'upload-icon' && uploadIconHTML}
        </div>
      </div>
    );
  }
}
