import './Main.scss';
import React, { PropTypes } from 'react';


const Main = props => {
  let classList = props.extraClass ?
    `global-content-Main ${props.extraClass}` :
    'global-content-Main';
  return (
    <div className={classList}>
      {props.children}
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
  extraClass: PropTypes.string,
};

export default Main;
