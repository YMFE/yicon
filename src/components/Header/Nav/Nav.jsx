import React, { Component } from 'react';
import styles from './Nav.scss';
import IconMenu from 'material-ui/IconMenu';
import NavMenuItemList from '../NavMenuItemList/NavMenuItemList.jsx';
import FlatButton from 'material-ui/FlatButton';

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    // 应该AJAX获取导航菜单
    const data = [
      {
        menuName: '图标库',
        menuItems: [
          { primaryText: '去哪儿网3W图标库' },
          { primaryText: 'QUA图标库' },
          { primaryText: 'YO图标库' },
          { primaryText: '大住宿图标库' },
        ],
      },
      {
        menuName: '图标管理',
        menuItems: [
          { primaryText: '我上传的图标' },
          { primaryText: '我收藏的图标' },
          { primaryText: '我的图标项目' },
        ],
      },
    ];
    this.setState({ data });
  }

  render() {
    const menuNodes = this.state.data.map((menu, index) => (
      <IconMenu
        iconButtonElement={
          <FlatButton
            label={menu.menuName}
            labelStyle={{
              color: '#212121',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            style={{ marginLeft: '34px' }}
          />}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        key={index}
      >
        <NavMenuItemList data={menu.menuItems} />
      </IconMenu>
    ));
    return (
      <div className={styles.nav}>
        {menuNodes}
      </div>
    );
  }
}

export default Nav;
