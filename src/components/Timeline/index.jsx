import './Timeline.scss';
import React, { PropTypes } from 'react';

const Timeline = (props) => {
  let classList = props.extraClass ? `global-timeline ${props.extraClass}` : 'global-timeline';
  return (
    <dl className={classList}>
      {props.children}
    </dl>
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
