import './Notification.scss';
import React, { Component, PropTypes } from 'react';
import InfoItem from './InfoItem.jsx';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main, Timeline, Icon } from '../../components/';
import { autobind } from 'core-decorators';
import {
  getInfo,
} from '../../actions/notification';

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
      tag: 'ALL',
    };
  }
  componentWillMount() {
    this.props.getInfo();
  }
  getDataBytag() {
    let attrName;
    if (this.state.tag === 'ALL') {
      attrName = 'allInfo';
    } else if (this.state.tag === 'SYSTEM') {
      attrName = 'systemInfo';
    }
    attrName = 'projectInfo';
    return this.props[attrName] && this.props[attrName].list || [];
  }
  @autobind
  changeTag(e) {
    const nextTag = e.currentTarget.dataset.tag;
    this.setState({
      tag: nextTag,
    });
  }
  createInfoTimeString(t) {
    const time = new Date(t);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const str = [];
    if (diff < 86400000) {
      str.push('昨天');
      if (diff < 43200000) {
        str.push('上午');
      } else {
        str.push('下午');
      }
      str.push(` ${time.getHours()}:${time.getMinutes()}`);
    } else {
      str.push(`${time.getYears()}.${time.getMonth() + 1}.${time.getDate()}`);
      str.push(` ${time.getHours()}:${time.getMinutes()})`);
    }
    return str.join('');
  }

  render() {
    let mainClassList = this.state.empty ? 'empty-container' : '';
    const InfoList = this.getDataBytag();
    return (
      <div className="notification">
        <SubTitle tit={'我的消息'} />
        <Content>
          <Menu>
            <li
              className={this.state.tag === 'ALL' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="ALL"
            >
              <a>全部消息<i className={"info-cont"}>{this.props.allInfo.unReadCount}</i></a>
            </li>
            <li
              className={this.state.tag === 'SYSTEM' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="SYSTEN"
            >
              <a>系统消息<i className={"info-cont"}>{this.props.systemInfo.unReadCount}</i></a>
            </li>
            <li
              className={this.state.tag === 'PROJECT' ? 'selected' : ''}
              onClick={this.changeTag}
              data-tag="PROJECT"
            >
              <a>项目消息<i className={"info-cont"}>{this.props.projectInfo.unReadCount}</i></a>
            </li>
          </Menu>
          <Main extraClass={mainClassList} >
            <Timeline>
              {InfoList.map(item => (
                <InfoItem
                  key={item.id}
                  tag={item.tag}
                  timeStr={this.createInfoTimeString(item.createdAt)}
                />
                )
              )
              }
              <dl>
                <dt className="description">
                  <p className="time">昨天下午 17:45</p>
                  <p className="tag">系统</p>
                </dt>
                <dd className="content">
                  <p className="title">您上传到<span className="key">QTA图标库</span>的图标已经审核完成</p>
                  <div className="detail">
                    <Icon
                      className="detail-item"
                      code={"&#xf50f;"}
                      name="上传"
                      showCode={false}
                    >
                      <p className="state passed">{"审核完成"}</p>
                    </Icon>
                    <Icon className="detail-item" name="上传" showCode={false} >
                      <p className="state passed">{"审核完成"}</p>
                    </Icon>
                    <Icon className="detail-item" name="上传" showCode={false} >
                      <p className="state checking">{"待审核"}</p>
                    </Icon>
                    <Icon className="detail-item" name="上传" showCode={false} >
                      <p className="state fault">{"审核失败"}</p>
                    </Icon>
                    <Icon className="detail-item" name="上传" showCode={false} >
                      <p className="state fault">{"审核失败"}</p>
                    </Icon>
                    <Icon className="detail-item" name="上传" showCode={false} >
                      <p className="state fault">{"审核失败"}</p>
                    </Icon>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt className="description">
                  <p className="time">昨天下午 17:45</p>
                  <p className="tag">系统</p>
                </dt>
                <dd className="content">
                  <p className="title"><span className="key">QTA图标库</span>管理员由eva.li更换为eva.li</p>
                  <div className="detail"></div>
                </dd>
              </dl>
              <dl>
                <dt className="description">
                  <p className="time">2016.11.02 15:32</p>
                  <p>系统</p>
                </dt>
                <dd className="content">
                  <p className="title"><span>Ydoc</span>项目图标变更</p>
                  <div className="detail">
                    <Icon className="detail-item new" name="购物车" showCode={false} code={"&#xf50f;"}>
                      <p className="state check">审核中</p>
                      <p className="tag">新</p>
                    </Icon>
                    <Icon className="detail-item old" name="购物车" showCode={false} code={"&#xf50f;"}>
                      <p className="state check">审核中</p>
                      <p className="tag">旧</p>
                    </Icon>
                    <Icon className="detail-item" name="购物车" showCode={false} code={"&#xf50f;"}>
                      <p className="state check">审核中</p>
                      <p className="tag">删</p>
                    </Icon>
                  </div>
                </dd>
              </dl>
            </Timeline>
          </Main>
        </Content>
      </div>
    );
  }
}
