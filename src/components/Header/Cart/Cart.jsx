import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import Icon from '../../common/Icon/Icon.jsx';
import styles from './Cart.scss';
import {
  getIconsInLocalStorage,
  getIconsInCart,
  deleteIconInLocalStorage,
} from '../../../actions/cart';

@connect(
  state => ({
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
    iconsInCart: state.cart.iconsInCart,
  }),
  { getIconsInLocalStorage, getIconsInCart, deleteIconInLocalStorage }
)
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentDidMount() {
    this.props.getIconsInLocalStorage();
  }

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

  handleRequestClose() {
    this.setState({
      isShow: false,
    });
  }

  removeFromCart(id) {
    return (
      () => {
        this.props.deleteIconInLocalStorage(id, true);
      }
    );
  }

  render() {
    const iconsInCart = this.props.iconsInCart || [];

    return (
      <div style={{ float: 'left' }}>
        <FlatButton
          onTouchTap={this.handleTouchTap}
          label="待选图标"
          labelStyle={{
            color: '#212121',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        />
        {this.props.iconsInLocalStorage.length}
        <Popover
          open={this.state.isShow}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Paper style={{ width: '346px', height: '150px' }}>
            {
              iconsInCart.map((icon) => (
                <div key={icon.id} className={styles.icon} onClick={this.removeFromCart(icon.id)}>
                  <Icon size={20} d={icon.path} />
                </div>
              ))
            }
          </Paper>
        </Popover>
      </div>
    );
  }
}

Cart.propTypes = {
  iconsInLocalStorage: PropTypes.array,
  iconsInCart: PropTypes.array,
  getIconsInLocalStorage: PropTypes.func,
  getIconsInCart: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
};

export default Cart;
