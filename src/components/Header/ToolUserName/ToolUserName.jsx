import './ToolUserName.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import LoginButton from './Login';

const Name = (props) => (
  <span className="avatar">
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
      {
        props.admin &&
          <li>
            <Link to="/admin/code">编码管理</Link>
          </li>
      }
      <li>
        <a href="/api/logout">退出</a>
      </li>
    </ul>
    <span className="arrow"></span>
  </div>
);

Tool.propTypes = {
  admin: PropTypes.bool,
};

const ToolUserName = (props) => {
  const className = classnames({
    'global-header-toolUserName-login': props.login,
    'global-header-toolUserName-nologin': !props.login,
  }, 'lists');

  return (
    <li className={className} >
      {props.login ? <Name name={props.name} /> : <LoginButton />}
      {props.login ? <Tool admin={props.admin} /> : null}
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
