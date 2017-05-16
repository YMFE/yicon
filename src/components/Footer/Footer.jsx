import React from 'react';
import './Footer.scss';
import pkg from '../../../package.json';

// console.log(pkg);
export default () => (
  <footer>
    <p className="copyright">
      Powered by YMFE,
      Build by <a href="https://github.com/YMFE/yicon" target="_blank">YIcon</a>（Version: {pkg.version}）
    </p>
  </footer>
);
