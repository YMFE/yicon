import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  fetchIconStatistic,
} from '../../actions/statistic';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';
import { iconStatus } from '../../constants/utils';

import './Statistic.scss';
import IconBtn from './IconBtn.jsx';
import Icon from '../../components/common/Icon/Icon.jsx';

@connect(
  state => ({
    list: state.statistic.list,
    statisticData: state.statistic.data,
    count: state.statistic.count,
    skiped: state.statistic.skiped,
    total: state.statistic.total,
  }),
  {
    fetchIconStatistic,
  }
)
export default class Statistic extends Component {

  static propTypes = {
    fetchIconStatistic: PropTypes.func,
    list: PropTypes.array,
    statisticData: PropTypes.array,
    count: PropTypes.number,
    skiped: PropTypes.number,
    total: PropTypes.number,
  };

  state = {
    isShowDownloadDialog: false,
    isShowLoading: false,
    length: 0,
    list: [],
    data: [],
    time: 1,
    name: '',
    code: 0,
    path: '',
    description: '',
  };
  componentWillMount() {
    this.fetchData(480, 1);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  @autobind
  handleScroll() {
    // 页面总高度
    const pageHeight = document.body.scrollHeight;
    // 滚动条到顶部的高度
    const scrollTop = document.body.scrollTop;
    // 浏览器视口高度
    const viewportHeight = window.innerHeight;
    const element = findDOMNode(this.refs.statistic);
    if (scrollTop >= 64) {
      element.setAttribute('class', 'statistic fixed');
    } else {
      element.setAttribute('class', 'statistic');
    }
    // 480 个图标大概显示时大概是 2 屏高
    const size = 480;

    if (scrollTop + viewportHeight >= pageHeight
      && this.state.time <= Math.ceil(6400 / size)) {
      const time = this.state.time + 1;
      this.fetchData(size, this.state.time);
      this.setState({ time });
    }
  }

  @autobind
  fetchData(size, number) {
    this.setState({
      isShowLoading: true,
    }, () => {
      this.props.fetchIconStatistic(size, number)
        .then(() => this.setState({ isShowLoading: false }))
        .catch(() => this.setState({ isShowLoading: false }));
    });
  }

  @autobind
  hoverIcon(e, icon) {
    const { fromElement, clientX, clientY } = e.nativeEvent;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { name, code, path, status, description } = icon;
    const classList = ['statistic', 'yicon-statistic-detail', 'yicon-info'];
    if (fromElement && classList.indexOf(fromElement.className) > -1 && path) {
      // left 和 top 分别定位详细信息 tip 的位置
      let left = 0;
      let top = 0;
      // 系统占用的编码需要展示描述信息，故需要减去 240
      const disabledHeight = status === iconStatus.DISABLED ? 180 : 0;
      // 根据图标的位置改变 tip 的 left,top，主要是处理右边和下边的情况
      // tip 的 宽为 180，高最大为 240，每个图标宽高为 60
      if (clientX + 180 > viewportWidth) {
        left = clientX - 210;
      } else {
        left = clientX + 30;
      }
      if (clientY + 240 > viewportHeight) {
        top = clientY - 30 - disabledHeight;
      } else {
        top = clientY;
      }
      const element = this.infoEle;
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.display = 'block';
      this.setState({ name, code, path, description });
    }
  }

  @autobind
  leaveIcon(e) {
    const { fromElement } = e.nativeEvent;
    if (fromElement && /yicon-statistic-wrapper/.test(fromElement.className)) {
      const element = document.querySelector('.yicon-info');
      element.style.display = 'none';
    }
  }

  render() {
    const description = this.state.description;
    let { mobile, os, other } = {};
    if (description) {
      const data = JSON.parse(description);
      mobile = data.mobile;
      os = data.os;
      other = data.other;
    }
    return (
      <div className="statistic" ref="statistic">
        <SubTitle tit={'图标使用详情统计'}>
          <div className="sub-title-chil">
            <span className="count">
              <b className="num">{this.props.total}</b>icons
            </span>
            <span className="powerby">已使用:</span>
            <span className="name">{this.props.count} icons</span>
            {/* <span className="powerby">已跳过:</span>
            <span className="name">{this.props.skiped} icons</span> */}
            <div className="tool-content">
              <ul className="code-list">
                <li className="code-item">0</li>
                <li className="code-item">1</li>
                <li className="code-item">2</li>
                <li className="code-item">3</li>
                <li className="code-item">4</li>
                <li className="code-item">5</li>
                <li className="code-item">6</li>
                <li className="code-item">7</li>
                <li className="code-item">8</li>
                <li className="code-item">9</li>
                <li className="code-item">A</li>
                <li className="code-item">B</li>
                <li className="code-item">C</li>
                <li className="code-item">D</li>
                <li className="code-item">E</li>
                <li className="code-item">F</li>
              </ul>
            </div>
          </div>
        </SubTitle>
        <div className="yicon-detail-main yicon-statistic">
          <div className="yicon-statistic-list">
            <ul>
              {
                this.props.list.map((item, i) => (
                  <li className="yicon-list-item" key={i}>{item}</li>
                ))
              }
            </ul>
          </div>
          <div className="yicon-statistic-detail">
            {
              this.props.statisticData.map((icon, i) => (
                <IconBtn
                  key={i}
                  icon={icon}
                  hoverIcon={this.hoverIcon}
                  leaveIcon={this.leaveIcon}
                />
              ))
            }
          </div>
          <div className="yicon-info" ref={(node) => { this.infoEle = node; }}>
            <div className="icon-info">
              <Icon
                extraClass={'statistic-icon'}
                size={48}
                fill={'#555f6e'}
                d={this.state.path}
              />
              <div className="title-code">
                <h4 className="icon-title" title={this.state.name}>{this.state.name}</h4>
                <div className="icon-code">
                  <span>{`&#x${(+this.state.code).toString(16)};`}</span>
                </div>
              </div>
            </div>
            {description &&
              (<div className="icon-description">
                <h4>编码系统占用：</h4>
                <ul>
                  <li>设备：{mobile}</li>
                  <li>系统：{os}</li>
                  <li>其他信息：{other || '无'}</li>
                </ul>
              </div>)
            }
          </div>
        </div>
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}
