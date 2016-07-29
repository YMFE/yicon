import './Cart.scss';
import Tool from './Tool.jsx';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Icon from '../../common/Icon/Icon.jsx';
import { autobind } from 'core-decorators';
import {
  getIconsInLocalStorage,
  getIconsInCart,
  deleteIconInLocalStorage,
  toggleCartListDisplay,
  dumpIconLocalStorage,
  changeCartSaveType,
} from '../../../actions/cart';
import {
  getUsersProjectInfo,
  saveToProject,
  saveToNewProject,
  choseProjectForSave,
} from '../../../actions/project';

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
    iconsInCart: state.cart.iconsInCart,
    isShowCart: state.cart.isShowCartList,
    saveType: state.cart.saveType,
    projectList: state.project.usersProject,
    projectForSave: state.project.projectForSave,
  }),
  {
    getIconsInLocalStorage,
    getIconsInCart,
    deleteIconInLocalStorage,
    toggleCartListDisplay,
    dumpIconLocalStorage,
    choseProjectForSave,
    getUsersProjectInfo,
    changeCartSaveType,
    saveToProject,
    saveToNewProject,
  }
)

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  componentWillMount() {
    const iconsInLocalStorage = this.props.iconsInLocalStorage || [];
    this.props.getIconsInCart({
      icons: iconsInLocalStorage,
    });
    this.props.getUsersProjectInfo();
  }

  componentDidMount() {
    this.props.getIconsInLocalStorage();
  }
  //
  // @autobind
  // handleRequestClose() {
  //   this.setState({
  //     isShow: false,
  //   });
  // }

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
    this.props.deleteIconInLocalStorage(parseInt(e.currentTarget.dataset.id, 10), true);
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
                    onClick={this.removeFromCart}
                    data-id={icon.id}
                  >
                    <span className="iconfont src_iconfont">
                      <Icon size={20} d={icon.path} fill="#555f6e" />
                      <i className="iconfont delete">&#xf077;</i>
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
              {
                <Tool
                  saveType={this.props.saveType}
                  onDumpIcon={this.props.dumpIconLocalStorage}
                  onChangeSaveType={this.props.changeCartSaveType}
                  onSaveToProject={this.props.saveToProject}
                  onSaveToNewProject={this.props.saveToNewProject}
                  onChoseProjectForSave={this.props.choseProjectForSave}
                  projectForSave={this.props.projectForSave}
                  projectList={this.props.usersProject}
                  onCancelSave={this.shiftCartList}
                />
              }
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
  getIconsInCart: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  count: PropTypes.number,
  isShowCart: PropTypes.bool,
  saveType: PropTypes.oneOf([
    'SAVE_TO_PROJECT',
    'SAVE_TO_NEW_PROJECT',
    'DEFAULT',
  ]),
  toggleCartListDisplay: PropTypes.func,
  dumpIconLocalStorage: PropTypes.func,
  changeCartSaveType: PropTypes.func,
  usersProject: PropTypes.array,
  saveToProject: PropTypes.func,
  saveToNewProject: PropTypes.func,
  choseProjectForSave: PropTypes.func,
  getUsersProjectInfo: PropTypes.func,
  projectForSave: PropTypes.oneOf([
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    PropTypes.Object,
  ]),
};

export default Cart;
