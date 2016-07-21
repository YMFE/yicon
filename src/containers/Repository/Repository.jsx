import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../actions/cart';
import styles from './Repository.scss';
import Icon from '../../components/common/Icon/Icon.jsx';
import Slider from '../../components/common/Slider/Slider.jsx';

@connect(
  state => ({
    list: state.repository.currRepository.icons,
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
  }),
  { fetchRepositoryData, addIconToLocalStorage, deleteIconInLocalStorage }
)
export default class Repository extends Component {
  componentWillMount() {
    this.props.fetchRepositoryData(this.props.params.id);
  }

  getColor(id) {
    if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
      return '#00bcd4';
    }
    return '#000';
  }

  selectIcon(id) {
    return () => {
      if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
        this.props.deleteIconInLocalStorage(id);
      } else {
        this.props.addIconToLocalStorage(id);
      }
    };
  }

  render() {
    const { id } = this.props.params;
    return (
      <div>
        <div style={{ width: 200, padding: 10 }}>
          <Slider />
        </div>
        <h1>Repository</h1>
        <p>This is repository page. Id: {id}.</p>
        {
          this.props.list.map((icon) => (
            <div
              key={icon.id}
              className={styles.icon}
              onClick={this.selectIcon(icon.id)}
            >
              <Icon size={40} fill={this.getColor(icon.id)} d={icon.path} />
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
  addIconToLocalStorage: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  list: PropTypes.array,
  iconsInLocalStorage: PropTypes.array,
};
