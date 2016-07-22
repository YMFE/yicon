import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
// import styles from './Repository.scss';
import IconButton from '../../components/IconButton/IconButton.jsx';

@connect(
  state => ({
    list: state.repository.currRepository.icons,
  }),
  { fetchRepositoryData }
)
export default class Repository extends Component {
  componentWillMount() {
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
            <IconButton
              icon={icon}
              key={icon.id}
            />
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
  addIconToLocalStorage: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  list: PropTypes.array,
  iconsInLocalStorage: PropTypes.array,
};
