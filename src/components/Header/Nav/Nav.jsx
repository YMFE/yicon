import './Nav.scss';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

@connect(
  state => ({ userInfo: state.user.info })
)
class Nav extends Component {
  static propTypes = {
    list: PropTypes.array,
    name: PropTypes.string,
    userInfo: PropTypes.object,
  }

  render() {
    const { list, name, userInfo } = this.props;
    const List = () => (
      <ul className="quick-menu-sub">
        {list.map((item, index) => {
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
        })}
      </ul>
    );
    return (
      <li className="global-header-Nav">
        <a>{name}</a>
          {(list && list.length) > 0 ? <List /> : null}
      </li>
    );
  }
}

export default Nav;
