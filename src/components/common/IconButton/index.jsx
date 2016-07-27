import './IconButton.scss';
import React, { Component, PropTypes } from 'react';
import Icon from '../Icon/Icon.jsx';
class IconButton extends Component {

  render() {
    const { icon, size } = this.props;
    return (
      <div className={'icon-detail-item'}>
        <Icon size={size} d={icon.path} />
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.object,
  status: PropTypes.number,
  size: PropTypes.number,
  iconsInLocalStorage: PropTypes.array,
  deleteIconInLocalStorage: PropTypes.func,
  addIconToLocalStorage: PropTypes.func,
};

export default IconButton;
