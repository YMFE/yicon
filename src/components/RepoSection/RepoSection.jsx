import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './RepoSection.scss';
import Icon from '../common/Icon/Icon';

class RepoSection extends Component {
  render() {
    const { id, icons } = this.props;

    return (
      <div>
        <Link to={`/repositories/${id}`}>
          <div className={styles.box}>
            {
              icons.map((icon) => (
                <div key={icon.id} className={styles.item}>
                  <Icon size={20} d={icon.path} />
                </div>
              ))
            }
          </div>
        </Link>
      </div>
    );
  }
}

RepoSection.propTypes = {
  id: PropTypes.number.isRequired,
  icons: PropTypes.array.isRequired,
};

export default RepoSection;
