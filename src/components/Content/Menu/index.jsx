import './Menu.scss';
import React, { PropTypes } from 'react';

const Menu = props => {
  let classList = props.extraClass ?
    `global-content-menu ${props.extraClass}` :
    'global-content-menu';
  return (
    <div className={classList}>
      <ul>
        {props.children}
      </ul>
    </div>
  );
};

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
  extraClass: PropTypes.string,
};

export default Menu;
