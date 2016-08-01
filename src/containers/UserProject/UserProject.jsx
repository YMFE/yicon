import './UserProject.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import { Link } from 'react-router';
import Slider from '../../components/common/Slider/Slider.jsx';
import confirm from '../../components/common/Dialog/Confirm.jsx';

import IconButton from '../../components/common/IconButton/IconButton.jsx';
import {
  getUsersProjectList,
  getUserProjectInfo,
  patchUserProject,
  fetchMemberSuggestList,
} from '../../actions/project';
import EditProject from './Edit.jsx';
import ManageMembers from './ManageMembers.jsx';

@connect(
  state => ({
    usersProjectList: state.project.usersProjectList,
    currentUserProjectInfo: state.project.currentUserProjectInfo,
    suggestList: state.project.memberSuggestList,
  }),
  {
    getUsersProjectList,
    getUserProjectInfo,
    patchUserProject,
    fetchMemberSuggestList,
  }
)
class UserProject extends Component {
  static propTypes = {
    params: PropTypes.object,
    usersProjectList: PropTypes.array,
    currentUserProjectInfo: PropTypes.object,
    getUsersProjectList: PropTypes.func,
    fetchMemberSuggestList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
    patchUserProject: PropTypes.func,
    suggestList: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      showManageMember: false,
    };
  }
  componentDidMount() {
    this.props.getUsersProjectList();
    const current = this.props.currentUserProjectInfo;
    const id = parseInt(this.props.params.id, 10) || this.publicProjectList[0].id;
    if (!current || id !== parseInt(current.id, 10)) {
      this.props.getUserProjectInfo(id);
    }
    this.props.fetchMemberSuggestList();
  }
  componentWillReceiveProps(nextProps) {
    const current = nextProps.currentUserProjectInfo;
    this.setState({
      name: current.name,
      id: current.id,
      owner: current.projectOwner,
      isPublic: current.public,
      members: current.members,
    });
  }
  componentDidUpdate(nextProps) {
    const current = this.props.currentUserProjectInfo;
    const nextId = parseInt(nextProps.params.id, 10);
    if (!current || nextId !== parseInt(current.id, 10)) {
      this.props.getUserProjectInfo(nextId);
    }
  }
  @autobind
  editProject() {
    confirm({
      title: '编辑项目',
      extraClass: 'project-dialog',
      content: (
        <EditProject
          projectName={this.state.name}
          owner={this.state.owner}
          isPublic={this.state.isPublic}
          members={this.state.members}
          id={this.state.id}
          ref={(node) => {
            if (node) { this.editProject = node; }
          }}
        />
      ),
      onOk: () => {
        const {
          id,
          projectName,
          owner,
          isPublic,
        } = this.editProject.getValue();
        this.props.patchUserProject({
          id,
          name: projectName,
          publicProject: isPublic,
          owner: owner.id,
        });
      },
      onCancel: () => {},
    });
  }

  @autobind
  editMembers() {
    this.setState({
      showManageMember: true,
    });
  }
  @autobind
  closeManageMembers() {
    this.setState({
      showManageMember: false,
    });
  }
  @autobind
  updateManageMembers({ members }) {
    this.props.patchUserProject({
      id: this.props.currentUserProjectInfo.id,
      members,
    });
    this.closeManageMembers();
  }
  render() {
    const list = this.props.usersProjectList;
    const current = this.props.currentUserProjectInfo;
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
          />
        );
      });
    } else {
      iconList = null;
    }
    return (
      <div className="UserProject">
        <SubTitle tit="我的项目">
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
                    item.id === this.props.currentUserProjectInfo.id
                    ? 'selected'
                    : null
                  }
                >
                  <Link to={`/user/projects/${item.id}`}>{item.name}</Link>
                </li>
              ))
            }
          </Menu>
          <Main>
            <div className="UserProject-info">
              <header>
                <h3>{current.name}</h3>
              </header>
              {current.isOwner ?
                <menu className="options">
                  <span className="edit" onClick={this.editProject}>编辑项目</span>
                  <span className="delete">删除项目</span>
                  <span className="team-member" onClick={this.editMembers}>管理项目成员</span>
                </menu>
              : null
              }
              <div className="tool">
                <a href="#" className="options-btns btns-blue">
                  <i className="iconfont">&#xf50a;</i>
                  下载全部图标
                </a>
                <a href="#" className="options-btns btns-blue">
                  生成版本
                </a>
                <a href="#" className="options-btns btns-default">
                  操作日志
                </a>
                <a href="#" className="options-btns btns-default">
                  历史版本
                </a>
              </div>
            </div>
            <div className="clearfix icon-list">
              {iconList}
            </div>
          </Main>
        </Content>
        <ManageMembers
          showManageMember={this.state.showManageMember}
          onOk={this.updateManageMembers}
          onChange={this.props.fetchMemberSuggestList}
          onCancel={this.closeManageMembers}
          onChoseMember={this.handleChoseMember}
          suggestList={this.props.suggestList}
          members={current.members}
        />
      </div>
    );
  }
}
export default UserProject;
