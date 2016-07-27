import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchRepositoryData,
  changeIconSize,
  resetIconSize } from '../../actions/repository';
import Slider from '../../components/common/Slider/Slider.jsx';
import { SubTitle } from '../../components/';
import { autobind } from 'core-decorators';

import './Repository.scss';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    iconSize: state.repository.iconSize,
  }),
  { fetchRepositoryData, changeIconSize, resetIconSize }
)


export default class Repository extends Component {
  componentWillMount() {
    this.props.fetchRepositoryData(this.props.params.id);
    this.props.resetIconSize();
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }


  render() {
    // const { name, icons, user, id } = this.props.currRepository;
    const { name, icons, user } = this.props.currRepository;
    // 待解决：不知道为啥user会为undefined(initialState已经写为'{}')
    let admin = '';
    if (user) {
      admin = user.name;
    }
    return (
      <div className="repository">
        <SubTitle tit={name}>
          <div>
            <p>
              <span className="count"><b className="num">{icons.length}</b>icons</span>
              <span className="powerby">管理员:</span>
              <span className="name">{admin}</span>
            </p>
            <div className="content">
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
              <span
                style={{
                  float: 'right',
                  color: '#616161',
                  fontSize: 16,
                  lineHeight: '38px',
                }}
              >{parseInt(this.props.iconSize, 10)}px</span>
              <div style={{ width: 216, padding: 11, float: 'right' }}>
                <Slider
                  min={20}
                  max={64}
                  step={1}
                  defaultValue={64}
                  onChange={this.changeSize}
                />
              </div>
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
  changeIconSize: PropTypes.func,
  resetIconSize: PropTypes.func,
  iconSize: PropTypes.number,
  currRepository: PropTypes.object,
  params: PropTypes.object,
};
