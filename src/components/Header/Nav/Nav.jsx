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

  state = {
    isShow: false,
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
            <Link
              onClick={() => this.toggleMenuShow(false)}
              to={item.href}
              style={{ display: 'block', padding: '0 20px' }}
            >
              {item.name}
            </Link>
          </li>
        );
      }
      return null;
    }).filter(v => v !== null);

    return navList;
  }

  toggleMenuShow(isShow) {
    this.setState({
      isShow,
    });
  }

  render() {
    const { name } = this.props;
    const list = this.getNavList();
    if (!list.length) return null;

    return (
      <li
        onMouseOver={() => this.toggleMenuShow(true)}
        onMouseOut={() => this.toggleMenuShow(false)}
        className={`global-header-Nav ${this.state.isShow ? 'hover' : ''}`}
      >
        <a>{name}</a>
        <ul className="quick-menu-sub" >{list}</ul>
      </li>
    );
  }
}

export default Nav;
