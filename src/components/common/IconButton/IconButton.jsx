import './IconButton.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../../actions/cart';
import Icon from '../Icon/Icon.jsx';
import process from 'process';
let ClipboardButton;

/* eslint-disable global-require */
if (process.browser) {
  ClipboardButton = require('react-clipboard.js');
}
/* eslint-enable global-require */

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
  }),
  { addIconToLocalStorage, deleteIconInLocalStorage }
)
class IconButton extends Component {

  // 暂时回调打印console.log 后期显示tips
  copySuccess(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  }
  copyError(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  }

  isSelected(id) {
    if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
      return true;
    }
    return false;
  }

  selectIcon(id) {
    return () => {
      if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
        this.props.deleteIconInLocalStorage(id);
      } else {
        this.props.addIconToLocalStorage(id);
      }
    };
  }

  render() {
    const { icon } = this.props;
    const selected = this.isSelected(icon.id);
    const fill = selected ? '#008ed6' : '#555f6e';
    // 由登录转态决定，暂时写死
    const status = 2;

    const toolList = {
      download: <i className={"tool-item iconfont download"} title="下载图标">&#xf50b;</i>,
      edit: <i className={"tool-item iconfont edit"} title="图标替换">&#xf515;</i>,
      copy:
        <ClipboardButton
          component="i"
          className={"tool-item iconfont copy"}
          title="复制code"
          data-clipboard-text={`\\u${icon.code.toString(16)}`}
          onSuccess={this.copySuccess}
          onError={this.copyError}
        >&#xf514;</ClipboardButton>,
      cart:
        <i
          className={"tool-item iconfont car"}
          onClick={this.selectIcon(icon.id)}
          title="加入小车"
        >&#xf50f;</i>,
    };

    let tool = '';
    if (+status === +1) {
      tool = (
        <div className={"tool"}>
          {toolList.cart}
        </div>
      );
    } else if (+status === +2) {
      tool = (
        <div className={"tool"}>
          {toolList.download}
          {toolList.copy}
          {toolList.cart}
        </div>
      );
    } else if (+status === +3) {
      tool = (
        <div className={"tool"}>
          {toolList.download}
          {toolList.edit}
          {toolList.copy}
          {toolList.cart}
        </div>
      );
    }
    return (
      <div className={`icon-detail-item ${selected ? 'active' : ''}`}>
        <div className={"info"}>
          <div className={"icon"} onClick={this.selectIcon(icon.id)}>
            <Icon size={64} fill={fill} d={icon.path} />
          </div>
          <div className={"name"}>{icon.name}</div>
          <div className={"code"}>{`&#${icon.code.toString(16)};`}</div>
        </div>
        {tool}
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.object,
  status: PropTypes.number,
  iconsInLocalStorage: PropTypes.array,
  deleteIconInLocalStorage: PropTypes.func,
  addIconToLocalStorage: PropTypes.func,
};

export default IconButton;
