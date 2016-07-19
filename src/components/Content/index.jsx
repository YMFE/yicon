import './Content.scss';
import React, { PropTypes } from 'react';


const Content = props => {
  let classList = props.extraClass ? `global-content ${props.extraClass}` : 'global-content';
  return (
    <div className={classList}>
      {props.children}
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

export default Content;
