import React from 'react';
import styles from './Header.scss';
import Nav from './Nav/Nav';
import ToolUserName from './ToolUserName/ToolUserName.jsx';
import LogOut from './LogOut/LogOut.jsx';
import Search from './Search/Search';
import Logo from './Logo/Logo';
import Cart from './Cart/Cart';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <Logo />
      <Nav />
      <div className={styles.tools}>
        <ToolUserName />
        <LogOut />
        <Cart />
        <Search />
      </div>
    </div>
  </header>
);

export default Header;
