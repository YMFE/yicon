import './Info.scss';
import { Link } from 'react-router';
import React, { PropTypes } from 'react';

const Info = (props) => (
  <li className="lists">
    <Link to="/user/notifications" className="nav-message">
      <i className="iconfont">&#xf50d;</i>
      {
        props.infoCont
        ? <i className="nav-message-count">{props.infoCont}</i>
        : null
      }
    </Link>
  </li>
);

Info.propTypes = {
  infoCont: PropTypes.number,
};

export default Info;
