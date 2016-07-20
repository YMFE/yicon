import './Nav.scss';
import React, { Component, PropTypes } from 'react';

class Nav extends Component {

  render() {
    const { list, name } = this.props;

    return (
      <div className={"global-header-Nav"}>
        <div
          iconButtonElement={
            <div
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
                <div primaryText={menuItem.name} key={index} />)
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
};

export default Nav;
