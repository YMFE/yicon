import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
import { addIconToCart, deleteIconInCart } from '../../actions/cart';
import styles from './Repository.scss';
import Icon from '../../components/common/Icon/Icon.jsx';

@connect(
  state => ({
    list: state.repository.currRepository.icons,
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
  }),
  { fetchRepositoryData, addIconToCart, deleteIconInCart }
)
export default class Repository extends Component {
  componentDidMount() {
    this.props.fetchRepositoryData(this.props.params.id);
  }

  getColor(id) {
    if (this.props.iconsInLocalStorage.indexOf(id) !== -1) {
      return '#00bcd4';
    }
    return '';
  }

  selectIcon(iconId) {
    return (
      (Id) => (
        () => {
          if (this.props.iconsInLocalStorage.indexOf(Id) !== -1) {
            this.props.deleteIconInCart(Id);
          } else {
            this.props.addIconToCart(Id);
          }
        }
      )
    )(iconId);
  }

  render() {
    const { id } = this.props.params;
    return (
      <div>
        <h1>Repository</h1>
        <p>This is repository page. Id: {id}.</p>
        {
          this.props.list.map((icon) => (
            <div key={icon.id} className={styles.icon} onClick={this.selectIcon(icon.id)}>
              <Icon size={20} fill={this.getColor(icon.id)} d={icon.path} />
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
  addIconToCart: PropTypes.func,
  deleteIconInCart: PropTypes.func,
  list: PropTypes.array,
  iconsInLocalStorage: PropTypes.array,
};
