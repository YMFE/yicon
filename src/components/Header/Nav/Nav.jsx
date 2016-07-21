import './Nav.scss';
import React, { Component, PropTypes } from 'react';

class Nav extends Component {
  render() {
    const { list, name, href } = this.props;
    let List = () => (
      <ul className="quick-menu-sub">
        {list.forEach((item, index) => (
          <li key={index}><a>{item.name}</a></li>
        ))}
      </ul>
    );
    return (
      <li className="global-header-Nav">
        <a href={href}>{name}</a>
          {list.length > 0 ? <List /> : null}
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
