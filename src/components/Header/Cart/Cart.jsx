import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import RepoSection from '../../RepoSection/RepoSection';
import {
  initCart,
} from '../../../actions/initCart';
import {
  getCartDes,
} from '../../../actions/getCartDes';

@connect(
  state => ({ cartIcons: state.cartIcons }),
  state => ({ cartDes: state.cartDes })
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
    this.props.dispatch(initCart());
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      isShow: true,
      anchorEl: event.currentTarget,
    });
    // 待优化：可以判断 cartIcons 是否改变，选择是否更新 cartDes
    const cartIcons = this.props.cartIcons || [{ iconId: 1 }, { iconId: 3 }];
    this.props.dispatch(getCartDes({
      icons: cartIcons.map(icon => icon.iconId),
    }));
  }

  handleRequestClose() {
    this.setState({
      isShow: false,
    });
  }

  render() {
    const cartDes = this.props.cartDes || [];

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
              cartDes.map(repo => (
                <RepoSection
                  key={repo.id}
                  id={repo.id}
                  icons={repo.icons}
                />
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
  cartIcons: PropTypes.array,
  cartDes: PropTypes.array,
};

export default Cart;
