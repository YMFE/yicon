import './Nav.scss';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import React, { Component, PropTypes } from 'react';

@connect(state => ({ userInfo: state.user.info }))
class Nav extends Component {
  static propTypes = {
    list: PropTypes.array,
    name: PropTypes.string,
    userInfo: PropTypes.object,
  }

  @autobind
  getNavList() {
    const { list, userInfo } = this.props;
    const navList = list.map((item, index) => {
      if (userInfo.admin || !item.auth ||
        (item.auth === 'login' && userInfo.login) ||
        (item.auth === 'owner' && userInfo.repoAdmin && userInfo.repoAdmin.length)) {
        return (
          <li key={index}>
            <Link to={item.href}>
              {item.name}
            </Link>
          </li>
        );
      }
      return null;
    }).filter(v => v !== null);

    if (!navList.length) return null;
    return <ul className="quick-menu-sub">{navList}</ul>;
  }

  render() {
    const { name } = this.props;
    return (
      <li className="global-header-Nav">
        <a>{name}</a>
        {this.getNavList()}
      </li>
    );
  }
}

export default Nav;
