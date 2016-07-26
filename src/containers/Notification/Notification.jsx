import './Notification.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main, Timeline, InfoItem } from '../../components/';
import { autobind } from 'core-decorators';
import {
  getInfo,
} from '../../actions/notification';
const scope = {
  repo: '系统',
  project: '项目',
};

@connect(
  state => ({
    allInfo: state.notification.allInfo,
    systemInfo: state.notification.systemInfo,
    projectInfo: state.notification.projectInfo,
  }),
  {
    getInfo,
  }
)
export default class Notification extends Component {
  static propTypes = {
    getInfo: PropTypes.func,
    allInfo: PropTypes.object,
    systemInfo: PropTypes.object,
    projectInfo: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      tag: 'all',
    };
  }
  componentWillMount() {
    this.props.getInfo();
  }
  getDataBytag() {
    const attrName = `${this.state.tag}Info`;
    return (this.props[attrName] && this.props[attrName].list) || [];
  }
  getDescribeForInfo(item) {
    const regExp = /@[^@]+@/g;
    let description;
    switch (item.type) {
      case 'UPLOAD':
        description = item.operation.replace(regExp, v => {
          let c = v.slice(1, -1);
          c = JSON.parse(c);
          return `<span class="key">${c.icon.name}</span>`;
        });
        break;
      case 'PROJECT_MEMBER_ADD':
      case 'PROJECT_MEMBER_DEL':
        description = item.operation.replace(regExp, v => {
          let c = v.slice(1, -1);
          c = JSON.parse(c);
          return `<span class="key">${c.user.name}</span>`;
        });
        break;
      default:

    }
    return description;
  }
  @autobind
  changeTag(e) {
    const nextTag = e.currentTarget.dataset.tag;
    this.setState({
      tag: nextTag,
    });
  }
  render() {
    const InfoList = this.getDataBytag();
    let mainClassList = InfoList.length === 0 ? 'empty-container' : '';
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
                this.props.allInfo.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.allInfo.unReadCount}</i> :
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
                this.props.allInfo.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.systemInfo.unReadCount}</i> :
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
                this.props.allInfo.unReadCount > 0 ?
                  <i className={"info-cont"}>{this.props.projectInfo.unReadCount}</i> :
                  null
              }
              </a>
            </li>
          </Menu>
          <Main extraClass={mainClassList} >
              {
                InfoList.length > 0 ?
                  <Timeline>
                  {InfoList.map(item => (
                    <InfoItem
                      key={item.id}
                      tag={scope[item.scope]}
                      timeStr={item.createdAt}
                      titleHtml={this.getDescribeForInfo(item)}
                      isNew={item.userLog.unread}
                    />
                    ))
                  }
                  </Timeline> :
                  null
              }
          </Main>
        </Content>
      </div>
    );
  }
}
