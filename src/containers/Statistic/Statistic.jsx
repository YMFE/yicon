import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  fetchIconStatistic,
} from '../../actions/statistic';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';

import './Statistic.scss';
import IconBtn from './IconBtn.jsx';

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
  };

  componentWillMount() {
    this.fetchData();
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
    const scrollTop = document.body.scrollTop;
    const element = findDOMNode(this.refs.statistic);
    if (scrollTop >= 64) {
      element.setAttribute('class', 'statistic fixed');
    } else {
      element.setAttribute('class', 'statistic');
    }
  }

  @autobind
  fetchData() {
    this.setState({
      isShowLoading: true,
    }, () => {
      this.props.fetchIconStatistic()
        .then(() => this.setState({ isShowLoading: false }))
        .catch(() => this.setState({ isShowLoading: false }));
    });
  }

  render() {
    return (
      <div className="statistic" ref="statistic">
        <SubTitle tit={'图标使用详情统计'}>
          <div className="sub-title-chil">
            <span className="count">
              <b className="num">{this.props.total}</b>icons
            </span>
            <span className="powerby">已使用:</span>
            <span className="name">{this.props.count} icons</span>
            <span className="powerby">已跳过:</span>
            <span className="name">{this.props.skiped} icons</span>
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
          <div className="yicon-statisitc-detail">
            {
              this.props.statisticData.map((icon, i) => (
                <IconBtn
                  key={i}
                  icon={icon}
                />
              ))
            }
          </div>
        </div>
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}
