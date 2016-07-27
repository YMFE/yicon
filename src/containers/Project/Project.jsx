import './Project.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main, DesIcon } from '../../components/';
import { Link } from 'react-router';
import Slider from '../../components/common/Slider/Slider.jsx';
import {
  getUsersProjectList,
  getPublicProjectList,
  getPublicProjectInfo,
  getUsersProjectInfo,
} from '../../actions/project';

@connect(
  state => ({
    publicProjectList: state.project.publicProjectList,
    userProjectList: state.project.userProjectList,
    currentUserProjectInfo: state.project.currentUserProjectInfo,
    currentPublicProjectInfo: state.project.currentPublicProjectInfo,
  }),
  {
    getUsersProjectList,
    getPublicProjectList,
    getPublicProjectInfo,
    getUsersProjectInfo,
  }
)
export default class Project extends Component {
  static propTypes = {
    params: PropTypes.object,
    publicProjectList: PropTypes.array,
    currentPublicProjectInfo: PropTypes.object,
    getUsersProjectList: PropTypes.func,
    getPublicProjectList: PropTypes.func,
    getPublicProjectInfo: PropTypes.func,
    getUsersProjectInfo: PropTypes.func,
  }
  componentWillMount() {
    this.props.getPublicProjectList();
    const current = this.props.currentPublicProjectInfo;
    const id = parseInt(this.props.params.id, 10);
    if (!current || id !== parseInt(current.id, 10)) {
      this.props.getPublicProjectInfo(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const current = this.props.currentPublicProjectInfo;
    const nextId = parseInt(nextProps.params.id, 10);
    if (!current || nextId !== parseInt(current.id, 10)) {
      this.props.getPublicProjectInfo(nextId);
    }
  }
  render() {
    const list = this.props.publicProjectList;
    const current = this.props.currentPublicProjectInfo;
    if (list.length === 0) return null;
    let iconList;
    if (current.icons && current.icons.length > 0) {
      iconList = current.icons.map((item, index) => (
        <DesIcon
          key={index}
          className="detail-icon"
          name={item.name}
          code={`&#x${item.code.toString(16)}`}
          showCode
          iconPath={item.path}
          iconSize={64}
        >
          <div className="tool">
            <i className="tool-item iconfont download" title="下载图标">&#xf50b;</i>
            <i className="tool-item iconfont edit" title="图标替换">&#xf515;</i>
            <i className="tool-item iconfont copy" title="复制code">&#xf514;</i>
            <i className="tool-item iconfont car" title="加入下车">&#xf50f;</i>
          </div>
        </DesIcon>
      ));
    } else {
      iconList = null;
    }
    return (
      <div className="Project">
        <SubTitle tit="我的公开项目">
          <Slider />
        </SubTitle>
        <Content>
          <Menu>
            {
              list.map((item, index) => (
                <li
                  key={index}
                  data-id={item.id}
                  className={
                    item.id === this.props.currentPublicProjectInfo.id
                    ? 'selected'
                    : null
                  }
                >
                  <Link to={`/projects/${item.id}`}>{item.name}</Link>
                </li>
              ))
            }
          </Menu>
          <Main>
            <div className="Project-info">
              <header>
                <h3>{current.name}</h3>
              </header>
              <div className="tool">
                <a href="#" className="options-btns btns-blue">
                  <i className="iconfont">&#xf50a;</i>
                  下载全部图标
                </a>
              </div>
            </div>
            <div className="clearfix icon-list">
              {iconList}
            </div>
          </Main>
        </Content>
      </div>
    );
  }
}
