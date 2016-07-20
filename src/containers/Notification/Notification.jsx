import './Notification.scss';
import React, { Component } from 'react';
import { SubTitle, Content, Menu, Main, Timeline, Icon } from '../../components/';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empty: false,
      allInfo: 0,
      systemInfo: 0,
      projectInfo: 0,
    };
  }
  render() {
    let mainClassList = this.state.empty ? 'empty-container' : '';
    return (
      <div className="notification">
        <SubTitle tit={'我的消息'} />
        <Content>
          <Menu>
            <li className={"selected"}>
              <a>全部消息<i className={"info-cont"}>{this.state.allInfo}</i></a>
            </li>
            <li><a>系统消息<i className={"info-cont"}>{this.state.systemInfo}</i></a></li>
            <li><a>项目消息<i className={"info-cont"}>{this.state.projectInfo}</i></a></li>
          </Menu>
          <Main extraClass={mainClassList} >
            <Timeline>
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
