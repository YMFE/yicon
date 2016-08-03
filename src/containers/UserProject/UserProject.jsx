import './UserProject.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import { Link } from 'react-router';
import SliderSize from '../../components/SliderSize/SliderSize';
import confirm from '../../components/common/Dialog/Confirm.jsx';
import { push } from 'react-router-redux';
import IconButton from '../../components/common/IconButton/IconButton.jsx';
import {
  getUsersProjectList,
  getUserProjectInfo,
  patchUserProject,
  fetchMemberSuggestList,
  patchProjectMemeber,
  generateVersion,
  deleteProject,
  deletePorjectIcon,
} from '../../actions/project';
import EditProject from './Edit.jsx';
import ManageMembers from './ManageMembers.jsx';
import GenerateVersion from './GenerateVersion.jsx';

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
    patchProjectMemeber,
    generateVersion,
    deleteProject,
    deletePorjectIcon,
    push,
  }
)
class UserProject extends Component {
  static propTypes = {
    params: PropTypes.object,
    usersProjectList: PropTypes.array,
    currentUserProjectInfo: PropTypes.object,
    currentUserProjectVersions: PropTypes.array,
    getUsersProjectList: PropTypes.func,
    fetchMemberSuggestList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
    deleteProject: PropTypes.func,
    deletePorjectIcon: PropTypes.func,
    patchUserProject: PropTypes.func,
    patchProjectMemeber: PropTypes.func,
    suggestList: PropTypes.array,
    generateVersion: PropTypes.func,
    push: PropTypes.func,
  }

  static defaultProps ={
    generateVersion: 'revision',
  }
  constructor(props) {
    super(props);
    this.state = {
      showEditProject: false,
      showManageMember: false,
      showGenerateVersion: false,
      showHistoryVersion: false,
      generateVersion: 'revision',
    };
  }
  componentDidMount() {
    this.props.getUsersProjectList().then(ret => {
      const id = this.props.params.id ? +this.props.params.id : '';
      const current = this.props.currentUserProjectInfo;
      if (!id && ret.data.organization) {
        const [firstProject] = ret.data.organization;
        if (firstProject && firstProject.id) {
          this.props.push(`/user/projects/${firstProject.id}`);
        }
      }
      if (!current || id !== +current.id) {
        this.props.getUserProjectInfo(id);
      }
      this.props.fetchMemberSuggestList();
    });
  }
  componentWillReceiveProps(nextProps) {
    const current = nextProps.currentUserProjectInfo;
    const nextId = nextProps.params.id;
    if (current) {
      this.setState({
        name: current.name,
        id: current.id,
        owner: current.projectOwner,
        isPublic: current.public,
        members: current.members,
      });
    }
    if (!nextId && this.props.usersProjectList[0]) {
      this.props.push(`/user/projects/${this.props.usersProjectList[0].id}`);
      return;
    }
    if (nextId !== this.props.params.id) {
      this.props.getUserProjectInfo(nextId);
    }
  }
  @autobind
  updateProjectDetail(result) {
    this.props.patchUserProject({
      id: result.id,
      name: result.projectName,
      publicProject: result.isPublic,
      owner: result.owner.id,
    });
    this.shiftEidtProject();
  }
  @autobind
  shiftEidtProject(isShow = false) {
    this.setState({
      showEditProject: isShow,
    });
  }
  @autobind
  deleteProject() {
    confirm({
      content: '删除项目后无法恢复，请慎重操作！',
      title: '删除项目',
      onOk: () => {
        const { id } = this.props.currentUserProjectInfo;
        this.props.deleteProject({
          id,
        });
      },
      onCancel: () => {},
    });
  }

  @autobind
  updateManageMembers({ members }) {
    this.props.patchProjectMemeber({
      id: this.props.currentUserProjectInfo.id,
      members,
    });
    this.shiftShowManageMembers();
  }
  @autobind
  shiftShowGenerateVersion(isShow = false) {
    this.setState({
      showGenerateVersion: isShow,
    });
  }
  @autobind
  shiftShowManageMembers(isShow = false) {
    this.setState({
      showManageMember: isShow,
    });
    if (!isShow) {
      this.ManageMembersEle.clearInput();
    }
  }
  @autobind
  changeGenerateVersion(e) {
    const version = e.currentTarget.querySelector('input').value;
    this.setState({
      generateVersion: version,
    });
  }
  @autobind
  generateVersion() {
    this.props.generateVersion({
      id: this.props.currentUserProjectInfo.id,
      versionType: this.state.generateVersion,
    });
    this.shiftShowGenerateVersion();
  }
  renderIconList() {
    const current = this.props.currentUserProjectInfo;
    let iconList = null;
    if (current.icons && current.icons.length > 0) {
      iconList = current.icons.map((item, index) => (
        <IconButton
          icon={item}
          key={index}
          toolBtns={['cart', 'copy', 'download', 'copytip', 'delete']}
          delete={(icons) => {
            this.props.deletePorjectIcon(
              this.props.currentUserProjectInfo.id,
              [icons]
            );
          }}
        />
      ));
    }
    return iconList;
  }
  renderDialogList() {
    const current = this.props.currentUserProjectInfo;
    let dialogList = null;
    if (current.name) {
      dialogList = [
        <EditProject
          key={1}
          projectName={current.name}
          owner={current.projectOwner}
          isPublic={current.public}
          members={current.members}
          id={current.id}
          onOk={this.updateProjectDetail}
          onCancel={this.shiftEidtProject}
          showEditProject={this.state.showEditProject}
          ref={
            (node) => {
              this.EditProjectEle = node;
            }
          }
        />,
        <ManageMembers
          key={2}
          showManageMember={this.state.showManageMember}
          onChange={this.props.fetchMemberSuggestList}
          onOk={this.updateManageMembers}
          onCancel={this.shiftShowManageMembers}
          suggestList={this.props.suggestList}
          members={current.members}
          ref={
            (node) => {
              this.ManageMembersEle = node;
            }
          }
        />,
        <GenerateVersion
          key={3}
          onOk={this.generateVersion}
          onCancel={this.shiftShowGenerateVersion}
          onChange={this.changeGenerateVersion}
          value={this.state.generateVersion}
          showGenerateVersion={this.state.showGenerateVersion}
        />,
      ];
    }
    return dialogList;
  }
  render() {
    const list = this.props.usersProjectList;
    const current = this.props.currentUserProjectInfo;
    const id = this.props.params.id;
    const iconList = this.renderIconList();
    const dialogList = this.renderDialogList();
    return (
      <div className="UserProject">
        <SubTitle tit="我的项目">
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
                  <span
                    className="edit"
                    onClick={() => {
                      this.shiftEidtProject(true);
                    }}
                  >
                    编辑项目
                  </span>
                  <span className="delete" onClick={this.deleteProject}>删除项目</span>
                  <span
                    className="team-member"
                    onClick={() => {
                      this.shiftShowManageMembers(true);
                    }}
                  >
                    管理项目成员
                  </span>
                </menu>
              : null
              }
              <div className="tool">
                <a
                  href="#"
                  className="options-btns btns-blue"
                  onClick={this.downloadAllIcon}
                >
                  <i className="iconfont">&#xf50a;</i>
                  下载全部图标
                </a>
                <a
                  href="#"
                  className="options-btns btns-blue"
                  onClick={() => { this.shiftShowGenerateVersion(true); }}
                >
                  生成版本
                </a>
                <Link
                  to={`/user/projects/${id}/logs`}
                  className="options-btns btns-default"
                >
                  操作日志
                </Link>
                <Link
                  to={`/user/projects/${id}/comparison`}
                  className="options-btns btns-default"
                >
                  版本对比
                </Link>
              </div>
            </div>
            <div className="clearfix icon-list">
              {iconList}
            </div>
          </Main>
        </Content>
        {dialogList}
      </div>
    );
  }
}
export default UserProject;
