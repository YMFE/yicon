import './IconBgGrid.scss';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon/Icon.jsx';

class IconBgGrid extends Component {

  render() {
    const { size, rows, icon } = this.props;
    const r = (size - 1) / rows;
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
      <div className="icon-big-img" style={{ width: size, height: size }}>
        <div className="bg-grid">
          {hlines}
          {vlines}
        </div>
        <div className="big-icon">
          <Icon size={size - 2} d={icon.path} />
        </div>
      </div>
    );
  }
}


IconBgGrid.defaultProps = {
  size: 305,
  rows: 16,
};

IconBgGrid.propTypes = {
  size: PropTypes.number,
  rows: PropTypes.number,
  icon: PropTypes.object,
};

export default IconBgGrid;
