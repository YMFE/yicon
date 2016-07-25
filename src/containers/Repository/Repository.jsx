import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
import { addIconToLocalStorage, deleteIconInLocalStorage } from '../../actions/cart';
import styles from './Repository.scss';
import Icon from '../../components/common/Icon/Icon.jsx';
import Slider from '../../components/common/Slider/Slider.jsx';
import { SubTitle } from '../../components/';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    iconsInLocalStorage: state.cart.iconsInLocalStorage,
  }),
  { fetchRepositoryData, addIconToLocalStorage, deleteIconInLocalStorage }
)


export default class Repository extends Component {
  componentWillMount() {
    this.props.fetchRepositoryData(this.props.currRepository.id);
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
    // const { name, icons, user, id } = this.props.currRepository;
    const { name, icons } = this.props.currRepository;
    return (
      <div className="repository">
        <SubTitle tit={name}>
          <div className="options">
            <div className="tools">
              <a href="#" className="options-btns btns-blue">
                <i className="iconfont">&#xf50a;</i>上传新图标
              </a>
              <a href="#" className="options-btns btns-blue">
                <i className="iconfont">&#xf50b;</i>下载全部图标
              </a>
              <a href="#" className="options-btns btns-default ml10">添加公告</a>
              <a href="#" className="options-btns btns-default">查看日志</a>
            </div>
            <div style={{ width: 200, padding: 10 }}>
              <Slider />
            </div>
          </div>
        </SubTitle>
        {
          icons.map((icon) => (
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
  fetchRepositoryData: PropTypes.func,
  addIconToLocalStorage: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  currRepository: PropTypes.object,
  iconsInLocalStorage: PropTypes.array,
};
