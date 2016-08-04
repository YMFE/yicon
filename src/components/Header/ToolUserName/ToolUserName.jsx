import './ToolUserName.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class UnLogin extends Component {
  qssoLogin() {
    window.QSSO.auth('/api/login');
  }

  render() {
    return (
      <a className="nologin" onClick={this.qssoLogin}>
        <i className="iconfont ">&#xf50e;</i>登录
      </a>
    );
  }
}

const Name = (props) => (
  <span className="avatar" href="#">
    <i className="iconfont">&#xf50e;</i>
    {props.name}
    <i className="iconfont">&#xf032;</i>
  </span>
);
Name.propTypes = {
  name: PropTypes.string,
};

const Tool = (props) => (
  <div className="user-dropdown">
    <ul>
      {
        props.admin &&
          <li>
            <Link to="/admin/authority/repo">权限管理</Link>
          </li>
      }
      <li>
        <span onClick={props.loginOut}>退出</span>
      </li>
    </ul>
    <span className="arrow"></span>
  </div>
);

Tool.propTypes = {
  admin: PropTypes.bool,
  loginOut: PropTypes.func,
};

const ToolUserName = (props) => {
  const className = classnames({
    'global-header-toolUserName-login': props.login,
    'global-header-toolUserName-nologin': !props.login,
  }, 'lists');

  return (
    <li className={className} >
      {props.login ? <Name name={props.name} /> : <UnLogin />}
      {props.login ? <Tool admin={props.admin} loginOut={props.loginOut} /> : null}
    </li>
  );
};

ToolUserName.propTypes = {
  name: PropTypes.string,
  login: PropTypes.bool,
  admin: PropTypes.bool,
  loginOut: PropTypes.func,
};

export default connect(
  state => ({
    login: !!state.user.info.login,
    name: state.user.info.real,
    admin: state.user.info.admin,
  })
)(ToolUserName);
