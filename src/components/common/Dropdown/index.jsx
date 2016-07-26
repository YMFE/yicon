import RcDropdown from 'rc-dropdown';
import './Dropdown.scss';
import React, { Component, PropTypes } from 'react';

export default class Dropdown extends Component {
  static defaultProps = {
    extraClass: '',
    menu: {},
    curtext: '',
    onVisibleChange: (visible) => {
      console.log(visible);
    },
  }
  static propTypes = {
    extraClass: PropTypes.string,
    menu: PropTypes.object,
    onVisibleChange: PropTypes.func,
    curtext: PropTypes.string,
  }
  render() {
    const { extraClass, menu, onVisibleChange, curtext } = this.props;
    const dropDownClass = ['rc-dropdown', extraClass].join(' ');
    return (
      <RcDropdown
        className={dropDownClass}
        trigger={['click']}
        overlay={menu}
        animation="slide-up"
        onVisibleChange={onVisibleChange}
      >
        <a href="#">{curtext}</a>
      </RcDropdown>
    );
  }
}
