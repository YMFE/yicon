import './ToolUserName.scss';
import React, { Component, PropTypes } from 'react';

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
  <a className="avatar" href="#">
    <i className="iconfont">&#xf50e;</i>
    {props.name}
    <i className="iconfont">&#xf032;</i>
  </a>
);
Name.propTypes = {
  name: PropTypes.string,
};

const Tool = () => (
  <div className="user-dropdown">
    <ul>
      <li className="">
        <a href="#">权限管理</a>
      </li>
      <li className="">
        <a href="#">退出</a>
      </li>
    </ul>
    <span className="arrow"></span>
  </div>
);

const ToolUserName = (props) => (
  <li className="lists global-header-toolUserName" >
    {props.login ? <Name name={props.name} /> : <UnLogin />}
    {props.login ? <Tool /> : null}
  </li>
);
ToolUserName.propTypes = {
  name: PropTypes.string,
  login: PropTypes.bool,
};

export default ToolUserName;
