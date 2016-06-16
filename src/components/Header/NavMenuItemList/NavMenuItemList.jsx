import React from 'react';
import MenuItem from 'material-ui/MenuItem';

const NavMenuItemList = (props) => (
  <div>
    {
      props.data.map((menuItem, index) => (
        <MenuItem primaryText={menuItem.primaryText} key={index} />)
      )
    }
  </div>
);

NavMenuItemList.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default NavMenuItemList;
