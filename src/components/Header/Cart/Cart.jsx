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
} from '../../../actions/cart';

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
    iconsInCart: state.cart.iconsInCart,
    type: state.cart.type,
  }),
  dispatch => ({
    getIconsInLocalStorage: dispatch(getIconsInLocalStorage),
    getIconsInCart: dispatch(getIconsInCart),
    deleteIconInLocalStorage: dispatch(deleteIconInLocalStorage),
  })
)

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  componentDidMount() {
    this.props.getIconsInLocalStorage();
  }

  @autobind
  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      isShow: true,
      anchorEl: event.currentTarget,
    });
    // 待优化：可以判断 iconsInLocalStorage 是否改变，选择是否更新 iconsInCart
    const iconsInLocalStorage = this.props.iconsInLocalStorage || [];
    this.props.getIconsInCart({
      icons: iconsInLocalStorage,
    });
  }

  @autobind
  handleRequestClose() {
    this.setState({
      isShow: false,
    });
  }

  removeFromCart(id) {
    return () => { this.props.deleteIconInLocalStorage(id, true); };
  }

  render() {
    const iconsInCart = this.props.iconsInCart || [];
    const { count } = this.props;
    return (
      <li className="lists global-header-cart">

        <a className="nav-car" href="#">
          <i className="iconfont">&#xf50f;</i>
          <span className="nav-car-count">{count}</span>
        </a>

        <div className="user-car" id="J_user_car" style="display: block;">
          <span className="arrow"></span>

          {iconsInCart ?
            <div className="car_bd">
              <ul className="clearfix fonts-selected-list">
              {
                iconsInCart.map((icon) => (
                  <li key={icon.id} className="icon" onClick={this.removeFromCart(icon.id)}>
                    <span className="iconfont src_iconfont">&#xf50f;
                      <Icon size={20} d={icon.path} />
                      <i className="iconfont delete">&#xf077;</i>
                    </span>
                  </li>
                ))
              }
              </ul>
            </div> :
            <p className="car_info">您的暂存架为空，请添加图标。</p>
          }

          {<Tool {...this.props} />}
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
  type: PropTypes.oneOf([
    'SAVE_TO_PROJECT',
    'SAVE_TO_NEW_PROJECT',
    'DEFAULT',
  ]),
};

export default Cart;
