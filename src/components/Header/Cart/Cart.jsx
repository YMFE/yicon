import './Cart.scss';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { push } from 'react-router-redux';

import { PROJECT_NAME } from '../../../constants/validate';
import {
  getIconsInLocalStorage,
  getIconsInCart,
  deleteIconInLocalStorage,
  toggleCartListDisplay,
  dumpIconLocalStorage,
} from '../../../actions/cart';
import {
  getUsersProjectList,
  saveToProject,
  saveToNewProject,
  choseProjectForSave,
} from '../../../actions/project';
import {
  downloadIcon,
} from '../../../actions/icon';
import Input from '../../common/Input/Index.jsx';
import Icon from '../../common/Icon/Icon.jsx';

@connect(
  state => ({
    userInfo: state.user.info,
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
    iconsInCart: state.cart.iconsInCart,
    isShowCart: state.cart.isShowCartList,
    projectList: state.project.usersProjectList,
    projectForSave: state.project.projectForSave,
  }),
  {
    getIconsInLocalStorage,
    getIconsInCart,
    deleteIconInLocalStorage,
    toggleCartListDisplay,
    dumpIconLocalStorage,
    choseProjectForSave,
    getUsersProjectList,
    saveToProject,
    saveToNewProject,
    downloadIcon,
    push,
  }
)

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      projectListShow: false,
      saveType: 'DEFAULT',
    };
  }

  componentWillMount() {
    const iconsInLocalStorage = this.props.iconsInLocalStorage || [];
    this.props.getIconsInCart({
      icons: iconsInLocalStorage,
    });
    if (this.props.userInfo.login) {
      this.props.getUsersProjectList();
    }
  }

  componentDidMount() {
    this.props.getIconsInLocalStorage();
    this.clickOutsideHandler = document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUpdate(_, nextState) {
    if (this.state.isShow !== nextState.isShow) {
      this.props.toggleCartListDisplay(nextState.isShow);
    }
  }

  componentWillUnmount() {
    this.clickOutsideHandler.remove();
    this.clickOutsideHandler = null;
  }

  @autobind
  onChoseProjectForSave(e) {
    const target = e.currentTarget;
    const targetData = target.dataset;
    const project = {
      id: targetData.id,
      name: target.innerText,
    };
    this.props.choseProjectForSave(project);
    this.toggleProjectList();
  }

  @autobind
  onChangeCartSaveType(e) {
    const saveType = e.currentTarget.dataset.type;
    this.changeCartSaveType(saveType);
  }
  @autobind
  onSaveToProject() {
    const { projectForSave, iconsInCart } = this.props;
    this.props.saveToProject(projectForSave, iconsInCart)
      .then(data => {
        if (data && data.payload.res) {
          this.dumpIcon();
          this.changeCartSaveType('DEFAULT');
          this.props.push(`/projects/${projectForSave.id}?from=cart${Date.now()}`);
          this.toggleProjectList();
        }
      });
  }
  @autobind
  onSaveToNewProject() {
    const { iconsInCart } = this.props;
    if (this.saveToProjectInput.isError()) {
      return;
    }
    const saveToProjectInput = this.saveToProjectInput.getVal();
    this.props.saveToNewProject(saveToProjectInput, iconsInCart)
      .then(data => {
        if (data && data.payload.res) {
          const targetUrl = data.payload.data.projectId ?
            `/projects/${data.payload.data.projectId}` :
            '/projects/';
          this.dumpIcon();
          this.changeCartSaveType('DEFAULT');
          this.props.push(targetUrl);
          this.toggleProjectList();
        }
      });
  }
  @autobind
  onDocumentClick(event) {
    const target = event.target;
    const cartNode = findDOMNode(this);
    if (!this.contains(cartNode, target)) {
      this.shiftCartList(null, false);
    }
  }
  contains(root, n) {
    let node = n;
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }
  changeCartSaveType(saveType) {
    this.setState({
      saveType,
    });
  }
  @autobind
  shiftCartList(e, isOpen) {
    if (isOpen !== undefined) {
      this.setState({
        isShow: isOpen,
      });
    } else {
      e.nativeEvent.stopImmediatePropagation();
      if (!this.contains(findDOMNode(this.refs.carBox), e.target)) {
        this.setState({
          isShow: !this.state.isShow,
        });
      }
    }
  }
  @autobind
  removeFromCart(e) {
    this.props.deleteIconInLocalStorage(
      parseInt(e.currentTarget.parentElement.parentElement.dataset.id, 10),
      true
    );
  }
  @autobind
  download() {
    const icons = this.props.iconsInCart.map((item) => (item.id));
    this.props.downloadIcon({
      icons,
    });
  }

  @autobind
  toggleProjectList() {
    this.setState({ projectListShow: !this.state.projectListShow });
  }
  @autobind
  dumpIcon() {
    this.props.dumpIconLocalStorage();
    this.shiftCartList(null, false);
  }
  @autobind
  cancleSave() {
    this.changeCartSaveType('DEFAULT');
    // this.props.onCancelSave(null, false);
  }
  toolRender() {
    // debugger
    const { projectList } = this.props;
    const { saveType, projectListShow } = this.state;
    // const { projectListShow } = this.state;

    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (this.props.userInfo.login) {
      status = 2;
    }

    switch (saveType) {
      case 'SAVE_TO_PROJECT':
        return (
          <div className="font-cdn save-to-old-pjc">
            <div
              onClick={this.toggleProjectList}
              className="font-project-name"
            >
              <input
                type="text"
                placeholder="请选择项目"
                value={this.props.projectForSave && this.props.projectForSave.name}
                disabled
              />
              <i className="iconfont">&#xf032;</i>
              {projectListShow &&
                <div className="save_to_pjc">
                  <ul >
                    {
                      projectList.length > 0 ?
                      projectList.map((item, index) =>
                        (
                        <li
                          className="pjc-item"
                          key={index}
                          data-id={item.id}
                          onClick={this.onChoseProjectForSave}
                        >
                        {item.name}
                        </li>
                        )
                      ) :
                        <li className="pjc-item" />
                    }
                  </ul>
                </div>
              }
            </div>
            <span className="button-wrapper">
              <a className="button-icon" onClick={this.onSaveToProject}>确定</a>
              <a
                className="button-icon button-cancel"
                onClick={this.cancleSave}
              >
                取消
              </a>
            </span>
          </div>
        );
      case 'SAVE_TO_NEW_PROJECT':
        return (
          <div className="font-cdn">
            <Input
              extraClass="font-project-name"
              regExp={PROJECT_NAME.reg}
              errMsg={PROJECT_NAME.message}
              placeholder="请输入项目名称"
              ref={(node) => {
                if (node) { this.saveToProjectInput = node; }
              }}
            />
            <span className="button-wrapper">
              <a className="button-icon" onClick={this.onSaveToNewProject}>确定</a>
              <a
                className="button-icon button-cancel"
                onClick={this.cancleSave}
              >
                取消
              </a>
            </span>
          </div>
        );
      default:
        return (
          <div className="font-cdn">
            <div className="clear-car">
              <span onClick={this.dumpIcon}>清空</span>
            </div>
            <div className="btn-download">
              {status >= 2 && projectList.length === 0 &&
                <a className="button-icon">
                  <a
                    style={{ 'margin-left': 0 }}
                    className="button-icon"
                    onClick={this.onChangeCartSaveType}
                    data-type="SAVE_TO_NEW_PROJECT"
                  >
                    保存为项目
                  </a>
                </a>
              }
              {status >= 2 && projectList.length > 0 &&
                <div className="save_selection">
                  <a className="button-icon">
                    保存为项目
                    <i className="iconfont">&#xf032;</i>
                  </a>

                  <div className="save_selection_btns">
                    <a
                      className="button-icon"
                      onClick={this.onChangeCartSaveType}
                      data-type="SAVE_TO_NEW_PROJECT"
                    >
                      保存为项目
                      <i className="iconfont">&#xf032;</i>
                    </a>
                    <div className="save-history">
                      <a
                        className="button-icon save-exsit"
                        data-type="SAVE_TO_PROJECT"
                        onClick={this.onChangeCartSaveType}
                      >
                        <span>保存到已有项目</span>
                      </a>
                    </div>
                  </div>
                </div>
              }
              <a
                className="button-icon button-cancel"
                onClick={this.download}
              >
                下载
              </a>
            </div>
          </div>
      );
    }
  }
  render() {
    const {
      iconsInCart,
      iconsInLocalStorage,
    } = this.props;
    const style = {
      display: this.props.isShowCart ? 'block' : 'none',
    };
    return (
      <li
        className="lists global-header-cart"
        onClick={this.shiftCartList}
      >

        <span className="nav-car" href="#">
          <i className="iconfont">&#xf50f;</i>
          {
            iconsInLocalStorage.length > 0 ?
              <span className="nav-car-count">
                {iconsInLocalStorage.length < 100 ? iconsInLocalStorage.length : '99+'}
              </span> :
              null
          }
        </span>

        <div className="user-car" id="J_user_car" ref="carBox" style={style}>
          <span className="arrow"></span>

          {iconsInCart.length > 0 ?
            <div className="car_bd">
              <ul className="clearfix fonts-selected-list">
              {
                iconsInCart.map((icon) => (
                  <li
                    key={icon.id}
                    className="icon"
                    data-id={icon.id}
                  >
                    <span className="iconfont src_iconfont">
                      <Icon size={20} d={icon.path} fill="#555f6e" />
                      <i className="iconfont delete" onClick={this.removeFromCart}>&#xf077;</i>
                    </span>
                  </li>
                ))
              }
              </ul>
            </div> :
            <p className="car_info">您的小车为空，请添加图标。</p>
          }
          {
            iconsInCart.length > 0 ?
              <div className="clearfix user-car-opt">
              {this.toolRender()}
              </div> :
            null
          }
        </div>
      </li>
    );
  }
}

Cart.propTypes = {
  iconsInLocalStorage: PropTypes.array,
  iconsInCart: PropTypes.array,
  getIconsInLocalStorage: PropTypes.func,
  downloadIcon: PropTypes.func,
  push: PropTypes.func,
  getIconsInCart: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  count: PropTypes.number,
  isShowCart: PropTypes.bool,
  toggleCartListDisplay: PropTypes.func,
  dumpIconLocalStorage: PropTypes.func,
  changeCartSaveType: PropTypes.func,
  projectList: PropTypes.array,
  saveToProject: PropTypes.func,
  saveToNewProject: PropTypes.func,
  choseProjectForSave: PropTypes.func,
  getUsersProjectList: PropTypes.func,
  projectForSave: PropTypes.oneOf([
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    PropTypes.Object,
  ]),
  userInfo: PropTypes.object,
};

export default Cart;
