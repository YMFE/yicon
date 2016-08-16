import './Cart.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { push } from 'react-router-redux';
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
          this.props.push(`/user/projects/${projectForSave.id}`);
          this.toggleProjectList();
        }
      });
  }
  @autobind
  onSaveToNewProject() {
    const { iconsInCart } = this.props;
    const saveToProjectInput = this.saveToProjectInput.value;
    this.props.saveToNewProject(saveToProjectInput, iconsInCart)
      .then(data => {
        if (data && data.payload.res) {
          const targetUrl = data.payload.data.id ?
            `/user/projects/${data.payload.data.id}` :
            '/user/projects/';
          this.dumpIcon();
          this.changeCartSaveType('DEFAULT');
          this.props.push(targetUrl);
          this.toggleProjectList();
        }
      });
  }
  changeCartSaveType(saveType) {
    this.setState({
      saveType,
    });
  }
  @autobind
  shiftCartList(e, isOpen) {
    let isShow;
    if (isOpen !== undefined) {
      isShow = isOpen;
    } else {
      isShow = e.type === 'mouseenter';
    }
    this.props.toggleCartListDisplay(isShow);
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
            <a className="button-icon" onClick={this.onSaveToProject}>确定</a>
            <a
              className="button-icon button-cancel"
              onClick={this.cancleSave}
            >
              取消
            </a>
          </div>
        );
      case 'SAVE_TO_NEW_PROJECT':
        return (
          <div className="font-cdn">
            <div className="font-project-name">
              <input
                type="text"
                placeholder="请输入项目名称"
                ref={(node) => {
                  if (node) { this.saveToProjectInput = node; }
                }}
                autoComplete={false}
              />
            </div>
            <a className="button-icon" onClick={this.onSaveToNewProject}>确定</a>
            <a
              className="button-icon button-cancel"
              onClick={this.cancleSave}
            >
              取消
            </a>
          </div>
        );
      default:
        return (
          <div className="save_ct">
            <div className="clear-car">
              <span onClick={this.dumpIcon}>清空</span>
            </div>
            <div className="btn-download">
              <div className="save_selection">
                <a className="ibtn">
                  <span>保存为项目 <i className="iconfont">&#xf032;</i></span>
                </a>

                <div className="save_selection_btns">
                  <a
                    className="ibtn"
                    onClick={this.onChangeCartSaveType}
                    data-type="SAVE_TO_NEW_PROJECT"
                  >
                    <span>
                      保存为项目
                      <i className="iconfont">&#xf032;</i>
                    </span>
                  </a>
                  <div className="save-history">
                    <a
                      className="ibtn"
                      data-type="SAVE_TO_PROJECT"
                      onClick={this.onChangeCartSaveType}
                    >
                      <span>保存到已有项目</span>
                    </a>
                  </div>
                </div>
              </div>
              <a
                className="ibtn ibtn-download"
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
        onMouseEnter={this.shiftCartList}
        onMouseLeave={this.shiftCartList}
      >

        <span className="nav-car" href="#">
          <i className="iconfont">&#xf50f;</i>
          {
            iconsInLocalStorage.length > 0 ?
              <span className="nav-car-count">{iconsInLocalStorage.length}</span> :
              null
          }
        </span>

        <div className="user-car" id="J_user_car" style={style}>
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
            <p className="car_info">您的暂存架为空，请添加图标。</p>
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
