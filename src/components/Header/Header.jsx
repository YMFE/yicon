import React from 'react';
import styles from './Header.scss';
import Logo from './Logo/Logo';
import Nav from './Nav/Nav';
import Tools from './Tools/Tools';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <Logo />
      <Nav />
      <Tools />
    </div>
  </header>
);

export default Header;
