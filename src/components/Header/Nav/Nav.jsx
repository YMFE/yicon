import './Nav.scss';
import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

class Nav extends Component {

  render() {
    const { list, name } = this.props;

    return (
      <div className={"global-header-Nav"}>
        <IconMenu
          iconButtonElement={
            <FlatButton
              label={name}
              labelStyle={{
                color: '#212121',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              style={{ marginLeft: '34px' }}
            />}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          <div>
            {
              list.map((menuItem, index) => (
                <MenuItem primaryText={menuItem.name} key={index} />)
              )
            }
          </div>
        </IconMenu>
      </div>
    );
  }
}

Nav.propTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
};

export default Nav;
