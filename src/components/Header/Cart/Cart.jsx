import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import {
  initCart,
} from '../../../actions/initCart';

@connect(state => ({ cartIcons: state.cartIcons }))
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
    this.props.dispatch(initCart());
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      isShow: true,
      anchorEl: event.currentTarget,
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
                <p><span>{icon.iconId}</span></p>
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
};

export default Cart;
