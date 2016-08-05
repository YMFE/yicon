import './DesIcon.scss';
import React, { PropTypes } from 'react';
import Icon from '../common/Icon/Icon.jsx';

const DesIcon = (props) => {
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
      <div className="icon-container">
        <div className="icon-room">
          <Icon
            d={props.iconPath}
            fill={props.iconFill}
            size={props.iconSize}
          />
        </div>
        {props.name
          ? <p><i className="name" title={props.name}>{props.name}</i></p>
          : null
        }
        {props.showCode ?
          <p
            className="code"
          >{props.code}
          </p> :
          null
        }
      </div>
      {props.children}
    </div>
  );
};

DesIcon.propTypes = {
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
  iconPath: PropTypes.string.isRequired,
  iconFill: PropTypes.string,
  iconSize: PropTypes.number,
};

DesIcon.defaultProps = {
  iconSize: 48,
  iconFill: '#555f6e',
};
export default DesIcon;
