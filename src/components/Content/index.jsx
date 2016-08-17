import './Content.scss';
import React, { PropTypes } from 'react';
import Main from './Main';
import Menu from './Menu';

const Content = props => {
  let classList = props.extraClass ? `global-content ${props.extraClass}` : 'global-content';
  return (
    <div className={classList}>
      <div className="content">
        {props.children}
      </div>
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
  extraClass: PropTypes.string,
};

export {
  Content,
  Menu,
  Main,
};
