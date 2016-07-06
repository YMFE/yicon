import React, { Component, PropTypes } from 'react';

const convert = (transform) =>
  Object.keys(transform).map(key => {
    const attr = Object.keys(transform[key]).map(k => transform[key][k]).join(',');
    return `${key}(${attr})`;
  }).join(' ');

class Icon extends Component {
  render() {
    const { size, d, fill } = this.props;

    const scale = size / 1024;

    const transform = {
      translate: { x: 0, y: size },
      scale: { x: scale, y: -scale },
    };

    const style = {
      width: size,
      height: size,
      display: 'inline-block',
      overflow: 'hidden',
    };

    return (
      <div style={style}>
        <svg
          width="1024"
          height="1024"
          viewBox="0 0 1024 1024"
        >
          <g className="transform-group">
            <g transform={convert(transform)}>
              <path fill={fill} d={d}></path>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

Icon.propTypes = {
  size: PropTypes.number,
  d: PropTypes.string.isRequired,
  fill: PropTypes.string,
};

Icon.defaultProps = { size: 32 };

export default Icon;
