import './Icon.scss';
import React, { PropTypes } from 'react';

const Icon = (props) => {
  let classList;
  if (props.className) {
    classList = props.className;
  } else if (props.extraClass) {
    classList = `global-icon ${props.extraClass}`;
  } else {
    classList = 'global-icon';
  }

  return (
    <div className={classList}>
      <div className="icon">
        <i
          className="iconfont"
          dangerouslySetInnerHTML={{ __html: props.code }}
        >
        </i>
      </div>
      {props.name ? <p className="name">{props.name}</p> : null}
      {props.showCode ?
        <p
          className="code"
        >{props.code}
        </p> :
        null}
      {props.children}
    </div>
  );
};

Icon.propTypes = {
  extraClass: PropTypes.string,
  className: PropTypes.string,
  code: PropTypes.string,
  state: PropTypes.string,
  name: PropTypes.string,
  showCode: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
};

export default Icon;
