import './Info.scss';
import React, { PropTypes } from 'react';

const Info = (props) => (
  <li className="lists">
    <a href="#" className="nav-message">
      <i className="iconfont">&#xf50d;</i>
      <i className="nav-message-count">{props.infoCont}</i>
    </a>
  </li>
);

Info.propTypes = {
  infoCont: PropTypes.number,
};

export default Info;
