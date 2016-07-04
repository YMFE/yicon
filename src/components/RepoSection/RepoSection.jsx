import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './RepoSection.scss';
import Icon from '../common/Icon/Icon';

class RepoSection extends Component {
  render() {
    const { id, name, iconCount, icons, user } = this.props;

    return (
      <div>
        <Link to={`/repositories/${id}`}>
          <div>
            <h3>{name}图标库</h3>
            <span className="totalNum">{iconCount}个图标</span>
          </div>
          <div className={styles.box}>
            {
              icons.map((icon) => (
                <div key={icon.id} className={styles.item}>
                  <Icon size={20} d={icon.path} />
                </div>
              ))
            }
          </div>
          <div>
            <ul>
              <li>管理人：{user.name}</li>
            </ul>
          </div>
        </Link>
      </div>
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
