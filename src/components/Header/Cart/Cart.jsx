import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import CartBox from './CartBox.jsx';

class Cart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
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
          <CartBox />
        </Popover>
      </div>
    );
  }
}

export default Cart;
