import React, { Component, PropTypes } from 'react';
import { iconStatus } from '../../constants/utils';
import Icon from '../../components/common/Icon/Icon.jsx';

import './IconBtn.scss';

export default class IconBtn extends Component {
  static propTypes = {
    icon: PropTypes.object,
    hoverIcon: PropTypes.func,
    leaveIcon: PropTypes.func,
  };

  render() {
    const icon = this.props.icon || {};
    return (
      <div
        className={
          `yicon-statistic-wrapper ${icon.status === iconStatus.DISABLED ? 'disabled-code' : ''}`
        }
        onMouseEnter={(e) => {
          this.props.hoverIcon(e, icon);
        }}
        onMouseLeave={this.props.leaveIcon}
      >
        {icon.path ?
          <Icon
            extraClass={'statistic-icon'}
            size={24}
            fill={'#555f6e'}
            d={icon.path}
          />
        : <div className="Icon statistic-icon"></div>
        }
      </div>
    );
  }
}
