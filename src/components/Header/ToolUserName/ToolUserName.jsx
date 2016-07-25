import './ToolUserName.scss';
import React, { PropTypes } from 'react';

const ToolUserName = (props) => {
  let Name;
  let Tool;
  let UnLogin = () => (
    <a className="nologin" href="#">
      <i className="iconfont ">&#xf50e;</i>登录
    </a>
  );

  if (props.login) {
    Name = () => (
      <a className="avatar" href="#">
        <i className="iconfont">&#xf50e;</i>
        {props.name}
        <i className="iconfont">&#xf032;</i>
      </a>
    );
    Tool = () => (
      <div className="user-dropdown" id="J_user_dropdown" >
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
  }

  return (
    <li className="lists global-header-toolUserName" >
      {
        props.login ? <Name /> : <UnLogin />
      }
      {
        props.login ? <Tool /> : null
      }
    </li>
  );
};

ToolUserName.propTypes = {
  name: PropTypes.string,
  login: PropTypes.bool,
};

export default ToolUserName;
