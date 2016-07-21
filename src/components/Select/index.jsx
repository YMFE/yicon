import './select.scss';
import React, { Component, PropTypes } from 'react';
// import React from 'react';
import RcSelect, { Option, OptGroup } from 'rc-select';
import classNames from 'classnames';
export default class Select extends Component {
  static Option = Option;
  static OptGroup = OptGroup;

  static defaultProps = {
    prefixCls: 'yiconselect',
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
  }
  static propTypes = {
    className: PropTypes.string,
    optionLabelProp: PropTypes.string,
  }
  static contextTypes = {
    antLocale: React.PropTypes.object,
  }

  render() {
    const {
      className, optionLabelProp,
    } = this.props;

    const cls = classNames({
      // [`${prefixCls}-lg`]: size === 'large',
      // [`${prefixCls}-sm`]: size === 'small',
      [className]: !!className,
    });
    /*
      // const { antLocale } = this.context;
      // if (antLocale && antLocale.Select) {
      //   notFoundContent = notFoundContent || antLocale.Select.notFoundContent;
      // }

      // if (combobox) {
      //   notFoundContent = null;
      //   // children 带 dom 结构时，无法填入输入框
      //   optionLabelProp = optionLabelProp || 'value';
      // }
    */
    return (
      <RcSelect
        {...this.props}
        className={cls}
        optionLabelProp={optionLabelProp || 'children'}
      />
    );
  }
}
