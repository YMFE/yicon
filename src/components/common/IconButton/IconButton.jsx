import './IconButton.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../../actions/cart';
import Icon from '../Icon/Icon.jsx';

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
  }),
  { addIconToLocalStorage, deleteIconInLocalStorage }
)
class IconButton extends Component {
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
    const status = 2;
    let tool = '';
    if (+status === +1) {
      tool = (
        <div className={"tool"}>
          <i
            className={"tool-item iconfont car"}
            onClick={this.selectIcon(icon.id)}
            title="加入小车"
          >&#xf50f;</i>
        </div>
      );
    } else if (+status === +2) {
      tool = (
        <div className={"tool"}>
          <i className={"tool-item iconfont download"} title="下载图标">&#xf50b;</i>
          <i className={"tool-item iconfont copy"} title="复制code">&#xf514;</i>
          <i
            className={"tool-item iconfont car"}
            onClick={this.selectIcon(icon.id)}
            title="加入小车"
          >&#xf50f;</i>
        </div>
      );
    } else if (+status === +3) {
      tool = (
        <div className={"tool"}>
          <i className={"tool-item iconfont download"} title="下载图标">&#xf50b;</i>
          <i className={"tool-item iconfont edit"} title="图标替换">&#xf515;</i>
          <i className={"tool-item iconfont copy"} title="复制code">&#xf514;</i>
          <i
            className={"tool-item iconfont car"}
            onClick={this.selectIcon(icon.id)}
            title="加入小车"
          >&#xf50f;</i>
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
