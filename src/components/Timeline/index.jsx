import './Timeline.scss';
import classnames from 'classnames';
import React, { PropTypes } from 'react';

const Timeline = (props) => {
  const classList = classnames('global-timeline', {
    [props.extraClass]: props.extraClass,
  });
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
