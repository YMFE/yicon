import './Notification.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main, Timeline, InfoItem } from '../../components/';
import { autobind } from 'core-decorators';
import { InfoTemplate } from '../../constants/utils.js';
import {
  getInfo,
  getInfoDetail,
} from '../../actions/notification';
import Pager from '../../components/common/Pager/';

const scope = {
  repo: '系统',
  project: '项目',
};

@connect(
  state => ({
    all: state.user.notification.allInfo,
    system: state.user.notification.systemInfo,
    project: state.user.notification.projectInfo,
    infoDetail: state.user.notification.infoDetail,
  }),
  {
    getInfo,
    getInfoDetail,
  }
)
export default class Notification extends Component {
  static propTypes = {
    getInfo: PropTypes.func,
    getInfoDetail: PropTypes.func,
    all: PropTypes.object,
    system: PropTypes.object,
    project: PropTypes.object,
    infoDetail: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      tag: 'all',
      infoState: {},
    };
  }

  componentDidMount() {
    this.props.getInfo();
  }

  @autobind
  onChangePage(page) {
    this.props.getInfo(this.state.tag, page);
  }

  @autobind
  onShowDetail(e, item) {
    const id = item.id;
    const infoState = Object.assign({}, this.state.infoState);
    if (this.props.infoDetail[id]) {
      infoState[id] = infoState[id] || {};
      infoState[id].isShow = !infoState[id].isShow;
    } else {
      this.props.getInfoDetail(id);
      infoState[id] = {
        isShow: true,
      };
    }
    this.setState({
      infoState,
    });
  }

  @autobind
  changeTag(e) {
    const nextTag = e.currentTarget.dataset.tag;
    this.setState({
      tag: nextTag,
    });
  }
  renderTimeItemDetail(item) {
    const { infoDetail } = this.props;
    if (infoDetail && infoDetail[item.id]) {
      return (
        <div className="detail">
        {InfoTemplate[item.type](infoDetail[item.id])}
        </div>
      );
    }
    return null;
  }
  renderTimeLine() {
    const attrName = this.state.tag;
    const { infoDetail } = this.props;
    const { infoState } = this.state;
    const infoList = (this.props[attrName] && this.props[attrName].list) || [];
    if (infoList.length <= 0) return null;
    const TiemlineEle = (
      <Timeline>
        {
          infoList.map((item, index) => (
            <InfoItem
              key={index}
              tag={scope[item.scope]}
              timeStr={item.createdAt}
              logCreator={item.logCreator}
              showTitleHtml
              item={item}
              isNew={item.userLog.unread}
              hasScope
              onShowDetail={(e) => { this.onShowDetail(e, item); }}
              showDetail={
                infoDetail && infoDetail[item.id] && infoState[item.id] && infoState[item.id].isShow
              }
            >
            {
              infoState[item.id] && infoState[item.id].isShow
              ? this.renderTimeItemDetail(item)
              : null
            }
            </InfoItem>
          ))
        }
      </Timeline>);
    return TiemlineEle;
  }
  render() {
    const attrName = this.state.tag;
    const infoList = (this.props[attrName] && this.props[attrName].list) || [];
    const currentPage = this.props[attrName].currentPage;
    const totalPage = this.props[attrName].totalPage;
    let mainClassList = infoList.length === 0 ? 'empty-container' : '';
    return (
      <div className="notification">
        <SubTitle tit={'我的消息'} />
        <Content>
          <Menu>
            <li
              className={this.state.tag === 'all' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="all"
            >
              <a>全部消息
              {
                this.props.all.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.all.unReadCount}</i> :
                  null
              }
              </a>
            </li>
            <li
              className={this.state.tag === 'system' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="system"
            >
              <a>系统消息
              {
                this.props.system.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.system.unReadCount}</i> :
                  null
              }
              </a>
            </li>
            <li
              className={this.state.tag === 'project' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="project"
            >
              <a>项目消息
              {
                this.props.project.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.project.unReadCount}</i> :
                  null
              }
              </a>
            </li>
          </Menu>
          <Main extraClass={mainClassList} >
            {this.renderTimeLine()}
            <div className="pager-container">
              {infoList.length > 0 ?
                <Pager
                  defaultCurrent={currentPage}
                  pageSize={10}
                  totalPage={Math.ceil(totalPage / 10)}
                  totalCount={totalPage}
                  onClick={this.onChangePage}
                /> :
                null
              }
            </div>
          </Main>
        </Content>
      </div>
    );
  }
}
