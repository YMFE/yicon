import './IconBgGrid.scss';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon/Icon.jsx';

class IconBgGrid extends Component {

  render() {
    const { bgSize, rows, iconPath, iconSize, iconColor } = this.props;
    const size = iconSize || bgSize - 2;
    const r = (bgSize - 1) / rows;
    const hlines = [];
    const vlines = [];
    for (let i = 0; i <= rows; i++) {
      if (i === rows / 2) {
        hlines.push(
          <div
            className="hline"
            style={{ top: i * r, background: '#ff8c8c' }}
            key={i}
          ></div>);
        vlines.push(
          <div
            className="vline"
            style={{ left: i * r, background: '#ff8c8c' }}
            key={i}
          ></div>);
      } else {
        hlines.push(<div className="hline" style={{ top: i * r }} key={i}></div>);
        vlines.push(<div className="vline" style={{ left: i * r }} key={i}></div>);
      }
    }

    return (
      <div className="icon-big-img" style={{ width: bgSize, height: bgSize }}>
        <div className="bg-grid">
          {hlines}
          {vlines}
        </div>
        <div className="big-icon" style={{ width: size, height: size }}>
          <Icon size={size} d={iconPath} fill={iconColor} />
        </div>
      </div>
    );
  }
}


IconBgGrid.defaultProps = {
  bgSize: 305,
  rows: 16,
  iconColor: '#000',
};

IconBgGrid.propTypes = {
  bgSize: PropTypes.number,
  rows: PropTypes.number,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  iconPath: PropTypes.string.isRequired,
};

export default IconBgGrid;
