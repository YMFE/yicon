import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  dumpIconLocalStorage,
} from '../../../actions/cart';

@connect(
  state => ({
    type: state.cart.saveType,
  }),
  dispatch => ({
    dumpIconLocalStorage: dispatch(dumpIconLocalStorage),
  })
)
class Tool extends Component {

  @autobind
  dumpIcon() {
    dumpIconLocalStorage();
  }
  render() {
    const { type } = this.props;
    switch (type) {
      case 'SAVE_TO_PROJECT':
        return (
          <div className="font-cdn save-to-old-pjc">
            <div className="font-project-name">
              <input type="text" placeholder="请选择项目" />
              <i className="iconfont">&#xf032;</i>
              <div className="save_to_pjc">
                <ul >
                  <li className="pjc-item">首页改版项目</li>
                  <li className="pjc-item">首页改版项目</li>
                </ul>
              </div>
            </div>
            <a href="#" className="button-icon">确定</a>
            <a href="#" className="button-icon button-cancel">取消</a>
          </div>
        );
      case 'SAVE_TO_NEW_PROJECT':
        return (
          <div className="font-cdn">
            <div className="font-project-name">
              <input type="text" placeholder="请输入项目名称" />
              <i className="iconfont">&#xf032;</i>
            </div>
            <a href="#" className="button-icon">确定</a>
            <a href="#" className="button-icon button-cancel">取消</a>
          </div>
        );
      default:
        return (
          <div className="save_ct">
            <div className="clear-car">
              <a href="#" onClick={this.dumpIcon}>清空</a>
            </div>
            <div className="btn-download">
              <div className="save_selection">
                <a href="#" className="ibtn">
                  <span>保存为项目 <i className="iconfont">&#xf032;</i></span>
                </a>

                <div className="save_selection_btns">
                  <a href="#" className="ibtn">
                    <span>保存为项目
                      <i className="iconfont">&#xf032;</i>
                    </span>
                  </a>

                  <div className="save-history">
                    <a href="#" className="ibtn"> 保存到已有项目</a>
                  </div>
                </div>
              </div>
              <a href="#" className="ibtn ibtn-download">下载</a>
            </div>
          </div>
      );
    }
  }
}

Tool.propTypes = {
  type: PropTypes.string,
  dumpIconLocalStorage: PropTypes.func,
};

export default Tool;
