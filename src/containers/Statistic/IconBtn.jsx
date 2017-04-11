import React, { Component, PropTypes } from 'react';
import Icon from '../../components/common/Icon/Icon.jsx';

import './IconBtn.scss';

export default class IconBtn extends Component {
  static propTypes = {
    icon: PropTypes.object,
  };
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const icon = this.props.icon || {};
    return (
      <div className="yicon-statistic-wrapper" data-code={icon.code}>
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
