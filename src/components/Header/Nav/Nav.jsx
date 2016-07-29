import './Nav.scss';
import { Link } from 'react-router';
import React, { Component, PropTypes } from 'react';

class Nav extends Component {
  render() {
    const { list, name, href } = this.props;
    const List = () => (
      <ul className="quick-menu-sub">
        {list.map((item, index) => (
          <li key={index}>
            <Link to={item.href}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    );
    return (
      <li className="global-header-Nav">
        <a href={href}>{name}</a>
          {(list && list.length) > 0 ? <List /> : null}
      </li>
    );
  }
}

Nav.propTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
  href: PropTypes.string,
};

export default Nav;
