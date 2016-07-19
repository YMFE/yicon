import './Header.scss';
import React, { PropTypes } from 'react';
import Nav from './Nav/Nav';
import ToolUserName from './ToolUserName/ToolUserName.jsx';
import LogOut from './LogOut/LogOut.jsx';
import Search from './Search/Search';
import Logo from './Logo/Logo';
import Cart from './Cart/Cart';

const list = [
  { name: '我上传的图标' },
  { name: '我收藏的图标' },
  { name: '我的图标项目' },
];

const Header = (props) => (
  <header className={"global-header"}>
    <div className="container">
      <Logo />
      <Nav name="图标库" list={props.list} />
      <Nav name="图标管理" list={list} />
      <div className="tools">
        <ToolUserName />
        <LogOut />
        <Cart />
        <Search />
      </div>
    </div>
  </header>
);

Header.propTypes = {
  list: PropTypes.array,
};

export default Header;
