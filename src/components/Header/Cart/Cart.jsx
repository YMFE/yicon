import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import Icon from '../../common/Icon/Icon.jsx';
import styles from './Cart.scss';
import {
  initCart,
} from '../../../actions/initCart';
import {
  getCartIcons,
} from '../../../actions/getCartIcons';

@connect(
  state => ({ cartIconIds: state.cartIconIds, cartIcons: state.cartIcons }),
  { initCart, getCartIcons }
)
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentDidMount() {
    this.props.initCart();
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      isShow: true,
      anchorEl: event.currentTarget,
    });
    // 待优化：可以判断 cartIconIds 是否改变，选择是否更新 cartIcons
    const cartIconIds = this.props.cartIconIds || [];
    this.props.getCartIcons({
      icons: cartIconIds,
    });
  }

  handleRequestClose() {
    this.setState({
      isShow: false,
    });
  }

  render() {
    const cartIcons = this.props.cartIcons || [];

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
        <Popover
          open={this.state.isShow}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Paper style={{ width: '346px', height: '150px' }}>
            {
              cartIcons.map((icon) => (
                <div key={icon.id} className={styles.item}>
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
  dispatch: PropTypes.func,
  cartIconIds: PropTypes.array,
  cartIcons: PropTypes.array,
  initCart: PropTypes.func,
  getCartIcons: PropTypes.func,
};

export default Cart;
