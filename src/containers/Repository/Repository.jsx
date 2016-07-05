import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
import styles from './Repository.scss';
import Icon from '../../components/common/Icon/Icon.jsx';

@connect(
  state => ({ list: state.repository.currRepository.icons }),
  { fetchRepositoryData }
)
export default class Repository extends Component {
  componentDidMount() {
    this.props.fetchRepositoryData(this.props.params.id);
  }

  render() {
    const { id } = this.props.params;
    return (
      <div>
        <h1>Repository</h1>
        <p>This is repository page. Id: {id}.</p>
        {
          this.props.list.map((icon) => (
            <div key={icon.id} className={styles.icon}>
              <Icon size={20} d={icon.path} />
            </div>
          ))
        }
      </div>
    );
  }
}

Repository.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  fetchRepositoryData: PropTypes.func,
  list: PropTypes.array,
};
