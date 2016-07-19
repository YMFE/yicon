import React, { Component } from 'react';
import { SubTitle, Content, Menu, Main } from '../../components/';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empty: true,
    };
  }
  render() {
    let mainClassList = this.state.empty ? 'empty' : '';
    return (
      <div className="notification">
        <SubTitle tit={'我的消息'} />
        <Content>
          <Menu>
            <li><a>全部消息<i className={"info-cont"}></i></a></li>
            <li><a>系统消息<i className={"info-cont"}></i></a></li>
            <li><a>项目消息<i className={"info-cont"}></i></a></li>
          </Menu>
          <Main extraClass={mainClassList} >
            <span>hahah</span>
          </Main>
        </Content>
      </div>
    );
  }
}
