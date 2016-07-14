import React from 'react';
import styles from './Logo.scss';
import { Link } from 'react-router';

const Logo = () => (
  <Link to="/" className={styles.logo}>&nbsp;</Link>
);

export default Logo;
