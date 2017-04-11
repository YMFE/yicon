import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import {
  fetchIconStatistic,
} from '../../actions/statistic';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';
import { startCode, endCode } from '../../constants/utils';

import './Statistic.scss';
import IconBtn from './IconBtn.jsx';

@connect(
  state => ({
    statisticData: state.statistic.rows,
    count: state.statistic.count,
  }),
  {
    fetchIconStatistic,
  }
)
export default class Statistic extends Component {

  static propTypes = {
    fetchIconStatistic: PropTypes.func,
    statisticData: PropTypes.array,
    count: PropTypes.number,
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

    const length = endCode - startCode + 1;
    const data = [];
    const list = [];
    for (let i = 0; i < length; i++) {
      if (i % 16 === 0) {
        const num = startCode + i;
        list.push(num.toString(16).toUpperCase());
      }
      data.push({});
    }
    this.setState({
      length,
      list,
      data,
    });
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
    const icons = this.props.statisticData || [];
    const data = this.state.data;
    icons.forEach(icon => {
      const { code } = icon;
      const index = code - parseInt(startCode, 10);
      data[index] = icon;
    });
    return (
      <div className="statistic" ref="statistic">
        <SubTitle tit={'图标使用详情统计'}>
          <div className="sub-title-chil">
            <span className="count">
              <b className="num">{this.state.length}</b>icons
            </span>
            <span className="powerby">已使用:</span>
            <span className="name">{this.props.count} icons</span>
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
                this.state.list.map((item, i) => (
                  <li className="yicon-list-item" key={i}>{item}</li>
                ))
              }
            </ul>
          </div>
          <div className="yicon-statisitc-detail">
            {
              data.map((icon, i) => (
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
