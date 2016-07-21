import './Timeline.scss';
import React, { PropTypes } from 'react';

const Timeline = (props) => {
  let classList = props.extraClass ? `global-timeline ${props.extraClass}` : 'global-timeline';
  return (
    <div className={classList}>
      {props.children}
    </div>
  );
};
Timeline.propTypes = {
  extraClass: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
};
export default Timeline;
