import './Project.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubTitle, Content, Menu, Main } from '../../components/';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import SliderSize from '../../components/SliderSize/SliderSize';
import IconButton from '../../components/common/IconButton/IconButton.jsx';

import {
  getPublicProjectList,
  getPublicProjectInfo,
} from '../../actions/project';

@connect(
  state => ({
    publicProjectList: state.project.publicProjectList,
    currentPublicProjectInfo: state.project.currentPublicProjectInfo,
  }),
  {
    getPublicProjectList,
    getPublicProjectInfo,
    push,
  }
)
export default class Project extends Component {
  static propTypes = {
    params: PropTypes.object,
    publicProjectList: PropTypes.array,
    currentPublicProjectInfo: PropTypes.object,
    getPublicProjectList: PropTypes.func,
    getPublicProjectInfo: PropTypes.func,
    push: PropTypes.func,
  }
  componentDidMount() {
    this.props.getPublicProjectList();
    const current = this.props.currentPublicProjectInfo;
    const id = this.props.params.id ? parseInt(this.props.params.id, 10) : '';
    if (!id && this.props.publicProjectList[0]) {
      this.props.push(`/projects/${this.props.publicProjectList[0].id}`);
    }
    if (!current || id !== parseInt(current.id, 10)) {
      this.props.getPublicProjectInfo(+id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const current = this.props.currentPublicProjectInfo;
    const nextId = nextProps.params.id ? parseInt(nextProps.params.id, 10) : '';
    if (!nextId && this.props.publicProjectList[0]) {
      this.props.push(`/projects/${this.props.publicProjectList[0].id}`);
    }
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
      iconList = current.icons.map((item, index) => {
        let icon = {
          id: item.id,
          name: item.name,
          path: item.path,
          code: item.code,
        };
        return (
          <IconButton
            icon={icon}
            key={index}
            toolBtns={['cart', 'copy', 'download', 'copytip']}
          />
        );
      });
    } else {
      iconList = null;
    }
    return (
      <div className="Project">
        <SubTitle tit="我的公开项目">
          <SliderSize />
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
