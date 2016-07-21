import './IconButton.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Icon from '../common/Icon/Icon.jsx';
// import { autobind } from 'core-decorators';
// import {
//   getIconsInLocalStorage,
//   getIconsInIconButton,
//   deleteIconInLocalStorage,
// } from '../../../actions/cart';

@connect(

)
class IconButton extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isShow: false,
  //   };
  // }

  render() {
    const { icon, fill, onClick } = this.props;
    return (
      <div className={"icon-detail-item active"} onClick={onClick}>
        <div className={"info"}>
          <div className={"icon"}>
            <Icon size={64} fill={fill} d={icon.path} />
          </div>
          <div className={"name"}>{icon.name}</div>
          <div className={"code"}>&amp;{icon.code}</div>
        </div>
        <div className={"tool"}>
          <span className={"copytip"}><i className={"iconfont"}>&#xf078;</i>复制成功！</span>
          <i className={"tool-item iconfont download"} title="下载图标">&#xf50b;</i>
          <i className={"tool-item iconfont edit"} title="图标替换">&#xf515;</i>
          <i className={"tool-item iconfont copy"} title="复制code">&#xf514;</i>
          <i className={"tool-item iconfont car"} title="加入下车">&#xf50f;</i>
        </div>
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.object,
  fill: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconButton;
