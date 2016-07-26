import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchRepositoryData } from '../../actions/repository';
import Slider from '../../components/common/Slider/Slider.jsx';
import { SubTitle } from '../../components/';

import './Repository.scss';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
  }),
  { fetchRepositoryData }
)


export default class Repository extends Component {
  componentWillMount() {
    this.props.fetchRepositoryData(this.props.params.id);
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
        <div className="yicon-detail-main">
          <div className="yicon-detail-list clearfix">
            {
              icons.map((icon) => (
                <IconButton
                  icon={icon}
                  key={icon.id}
                />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

Repository.propTypes = {
  fetchRepositoryData: PropTypes.func,
  addIconToLocalStorage: PropTypes.func,
  deleteIconInLocalStorage: PropTypes.func,
  currRepository: PropTypes.object,
  params: PropTypes.object,
};
