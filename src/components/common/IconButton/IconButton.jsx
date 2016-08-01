import './IconButton.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../../actions/cart';
import Icon from '../Icon/Icon.jsx';
import { autobind } from 'core-decorators';
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
    iconSize: state.repository.iconSize,
    userInfo: state.user.info,
  }),
  {
    addIconToLocalStorage,
    deleteIconInLocalStorage,
  }
)
class IconButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copytipShow: false,
      copyError: false,
      showDownLoadDial: false,
    };
  }

  @autobind
  copySuccess() {
    this.setState({
      copytipShow: true,
      copyError: false,
    });
  }
  // 待完成：copy失败(safari下)，提示按 ⌘-C 完成复制
  @autobind
  copyError() {
    this.setState({
      copytipShow: false,
      copyError: true,
    });
  }
  @autobind
  copyEnd() {
    this.setState({
      copytipShow: false,
    });
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
    const { icon, userInfo, download, repoId } = this.props;
    const selected = this.isSelected(icon.id);
    const fill = selected ? '#008ed6' : '#555f6e';
    const repositoryId = repoId || icon.repoVersion.repositoryId;

    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (userInfo.login) {
      status = 2;
      if (userInfo.repoAdmin.indexOf(repositoryId) !== -1) {
        status = 3;
      }
    }

    const toolList = {
      copytip:
        <span
          className={`copytip ${this.state.copytipShow ? 'show' : ''}`}
        >
          <i className="iconfont">&#xf078;</i>
          {this.state.copyError ? '再按 ⌘-C' : '复制成功！'}
        </span>,
      download:
        <i
          className={"tool-item iconfont download"}
          title="下载图标"
          onClick={download}
        >&#xf50b;</i>,
      edit: <i className={"tool-item iconfont edit"} title="图标替换">&#xf515;</i>,
      copy:
        <ClipboardButton
          component="i"
          className={"tool-item iconfont copy"}
          button-title="复制code"
          data-clipboard-text={String.fromCharCode(icon.code)}
          onSuccess={this.copySuccess}
          onError={this.copyError}
          button-onMouseOut={this.copyEnd}
        >&#xf514;</ClipboardButton>,
      cart:
        <i
          className={"tool-item iconfont car"}
          onClick={this.selectIcon(icon.id)}
          title="加入小车"
        >&#xf50f;</i>,
    };


    let tool = null;
    switch (+status) {
      case 1:
        tool = (
          <div className={"tool"}>
            {toolList.copytip}
            {toolList.download}
            {toolList.copy}
            {toolList.cart}
          </div>
        );
        break;
      case 2:
        tool = (
          <div className={"tool"}>
            {toolList.copytip}
            {toolList.download}
            {toolList.copy}
            {toolList.cart}
          </div>
        );
        break;
      default:
        tool = (
          <div className={"tool"}>
            {toolList.copytip}
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
            <Icon size={this.props.iconSize} fill={fill} d={icon.path} />
          </div>
          <div className={"name"} title={icon.name}>{icon.name}</div>
          <div className={"code"}>{`&#${icon.code.toString(16)};`}</div>
        </div>
        {tool}
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.object,
  userInfo: PropTypes.object,
  iconSize: PropTypes.number,
  repoId: PropTypes.number,
  iconsInLocalStorage: PropTypes.array,
  deleteIconInLocalStorage: PropTypes.func,
  addIconToLocalStorage: PropTypes.func,
  download: PropTypes.func,
};

export default IconButton;
