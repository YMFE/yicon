import React, { Component, PropTypes } from 'react';
import RcSelect, { Option, OptGroup } from 'rc-select';
import './Select.scss';
/**
 * 评分组件
 *
 * @component Selectfield
 * @version  0.0.1
 * @description 模拟select。
 * @autor leila.wang
 */

Option.propTypes.value = PropTypes.oneOfType([
  PropTypes.string, PropTypes.number,
]);

export {
  Option,
};
export default class Select extends Component {
  static Option = Option;
  static OptGroup = OptGroup;

  static defaultProps = {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false,
    notFoundContent: 'Not Found',
  }
  static contextTypes = {
    antLocale: React.PropTypes.object,
  }
  static propTypes = {
    prefixCls: PropTypes.string,
    showSearch: PropTypes.bool,
    optionLabelProp: PropTypes.string,
    notFoundContent: PropTypes.string,
    combobox: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
  }
  render() {
    let { notFoundContent, optionLabelProp } = this.props;
    const { combobox } = this.props;
    const { antLocale } = this.context;
    if (antLocale && antLocale.Select) {
      notFoundContent = notFoundContent || antLocale.Select.notFoundContent;
    }

    if (combobox) {
      notFoundContent = null;
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value';
    }

    return (
      <RcSelect
        {...this.props}
        placeholder="请选择"
        optionLabelProp={optionLabelProp || 'children'}
        notFoundContent={notFoundContent}
      />
    );
  }
}
