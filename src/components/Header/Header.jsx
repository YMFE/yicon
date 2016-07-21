import './Header.scss';
import React, { PropTypes } from 'react';
import Nav from './Nav/Nav';
import ToolUserName from './ToolUserName/ToolUserName.jsx';
// import LogOut from './LogOut/LogOut.jsx';
import Search from './Search/Search';
import Logo from './Logo/Logo';
import Cart from './Cart/Cart';
import Info from './Info/';

const iconManageList = [
  { name: '我上传的图标' },
  { name: '我收藏的图标' },
  { name: '我的图标项目' },
];

const Header = (props) => {
  let classList = '';
  if (props.className) {
    classList = props.className;
  } else if (props.extraClass) {
    classList = `global-header ${props.extraClass}`;
  } else {
    classList = 'global-header';
  }
  return (
    <header className={classList}>
      <div className="container">
        <Logo />
        <nav className="nav quick-menu">
          <ul>
            <Nav name="图标库" list={props.list} />
            <Nav name="图标管理" list={iconManageList} />
          </ul>
        </nav>
        <div className="quick-menu nav-menu-info">
          <ul className="clearfix">
            <ToolUserName login={props.login} name={props.name} />
            <Info infoCont={2} />
            <Cart />
            <li className="lists">
              <a href="#" className="upload"><i className="iconfont">&#xf50a;</i></a>
            </li>
            <Search />
          </ul>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  list: PropTypes.array,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  login: PropTypes.bool,
  name: PropTypes.string,
};

export default Header;
