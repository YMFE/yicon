import './RepoSection.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../common/Icon/Icon';

class RepoSection extends Component {
  render() {
    const { id, name, iconCount, icons, user } = this.props;

    return (
      <dl className="global-list-prj-item">
        <Link to={`/repositories/${id}`}>
          <dt>
            <h2>{name}</h2>
            <p>
              <i>{iconCount} icons</i>
              <span>{user.name}</span>
            </p>
          </dt>
          <dd>
            <ul className="prj-item-icon">
              {
                icons.map((icon) => (
                  <li key={icon.id}>
                    <Icon size={20} d={icon.path} />
                  </li>
                ))
              }
            </ul>
          </dd>
        </Link>
      </dl>
    );
  }
}

RepoSection.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  iconCount: PropTypes.number.isRequired,
  icons: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default RepoSection;
