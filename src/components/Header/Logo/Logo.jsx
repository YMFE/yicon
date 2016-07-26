import './Logo.scss';
import React from 'react';
import { Link } from 'react-router';

const Logo = () => (
  <Link to="/" className="global-header-logo">
    <i className="iconfont small-img" />
    <p>Icon Lab.</p>
  </Link>
);

export default Logo;
