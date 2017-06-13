import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  fetchIconStatistic,
} from '../../actions/statistic';
import { fetchRepository } from '../../actions/repository';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';
import { iconStatus } from '../../constants/utils';

import './Statistic.scss';
import IconBtn from './IconBtn.jsx';
import Icon from '../../components/common/Icon/Icon.jsx';

// 480 个图标大概显示时大概是 2 屏高
let size = 480;

@connect(
  state => ({
    list: state.statistic.list,
    statisticData: state.statistic.data,
    count: state.statistic.count,
    skiped: state.statistic.skiped,
    total: state.statistic.total,
    currRepository: state.repository.currRepository,
  }),
  {
    fetchIconStatistic,
    fetchRepository,
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
    currRepository: PropTypes.object,
    fetchRepository: PropTypes.func,
  };

  state = {
    isShowDownloadDialog: false,
    isShowLoading: false,
    list: [],
    data: [],
    time: 1,
    name: '',
    code: 0,
    path: '',
    description: '',
    showTip: false,
    hasMoreData: true,
  };

  componentDidMount() {
    // 浏览器视口高度
    const viewportHeight = window.innerHeight;
    size = Math.max(Math.ceil(viewportHeight / 46) * 16 * 2, 480);
    this.fetchData(1);
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
    this.saveStatisticFetchId();
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

    if (Math.ceil(scrollTop + viewportHeight) >= pageHeight) {
      if (this.state.time <= Math.ceil(6400 / size)) {
        const time = this.state.time + 1;
        this.fetchData(this.state.time);
        this.setState({ time });
      } else {
        this.setState({
          showTip: true,
          hasMoreData: false,
        });
      }
    }
  }

  @autobind
  fetchData(number) {
    this.setState({
      showTip: true,
      isShowLoading: true,
    }, () => {
      this.props.fetchIconStatistic(size, number)
        .then(() => this.setState({
          showTip: false,
          isShowLoading: false,
        }))
        .catch(() => this.setState({
          showTip: false,
          isShowLoading: false,
        }));
    });
  }

  @autobind
  hoverIcon(e, icon) {
    const { toElement } = e.nativeEvent;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { name, code, path, status, description } = icon;
    const node = document.querySelector(`div[id="${icon.id}"]`) || toElement;
    let targetElement = null;
    switch (toElement.tagName.toUpperCase()) {
      case 'SVG':
        targetElement = node;
        break;
      case 'PATH':
        targetElement = node;
        break;
      default:
        targetElement = toElement;
    }

    const toElementPosition = targetElement.getBoundingClientRect();
    if (!code) {
      return;
    }
    // left 和 top 分别定位详细信息 tip 的位置
    let left = 0;
    let top = 0;
    // elementX，elementY：hover时元素位置
    const elementX = toElementPosition.left;
    const elementY = toElementPosition.top;
    // 系统占用的编码需要展示描述信息，且 tip 高度最大为 240（120 + 60 + 60），故需要减去 120
    const disabledHeight = status === iconStatus.DISABLED ? 120 : 0;
    // 根据图标的位置改变 tip 的 left,top，主要是处理右边和下边的情况
    // tip 的 宽为 180，高最大为 240，每个图标宽高为 60
    if (elementX + 240 > viewportWidth) {
      left = elementX - 185;
    } else {
      left = elementX + 50;
    }
    if (elementY + 90 + disabledHeight > viewportHeight) {
      // 60 + 60 + 120
      top = elementY - 60 - disabledHeight;
    } else {
      top = elementY;
    }
    const element = this.infoEle;
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.display = 'block';
    this.setState({ name, code, path, description });
  }

  @autobind
  leaveIcon(e) {
    const { fromElement } = e.nativeEvent;
    if (fromElement && /yicon-statistic-wrapper/.test(fromElement.className)) {
      const element = document.querySelector('.yicon-info');
      element.style.display = 'none';
    }
  }

  @autobind
  saveStatisticFetchId() {
    const { currRepository: { id } } = this.props;
    if ((typeof +id === 'number') && id) {
      localStorage.setItem('statistic_id', id);
    }
    this.fetchStatisticWrapper();
  }

  @autobind
  fetchStatisticWrapper() {
    const id = localStorage.getItem('statistic_id');
    this.props.fetchRepository(id)
      .then(() => this.setState({ isShowLoading: false }))
      .catch(() => this.setState({ isShowLoading: false }));
  }

  render() {
    const description = this.state.description;
    const { currRepository: { name } } = this.props;
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
          <div
            className="yicon-loading-tip"
            style={{
              display: `${this.state.showTip ? 'block' : 'none'}`,
              color: '#333',
              textAlign: 'center',
            }}
          >
            {this.state.hasMoreData ? '正在加载...' : '没有更多啦'}
          </div>
          <div className="yicon-info" ref={(node) => { this.infoEle = node; }}>
            <h3 className="icon-library">{name || ''}</h3>
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
