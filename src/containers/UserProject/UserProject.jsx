import './UserProject.scss';
import axios from 'axios';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import { Link } from 'react-router';
import SliderSize from '../../components/SliderSize/SliderSize';
import confirm from '../../components/common/Dialog/Confirm.jsx';
import { replace } from 'react-router-redux';
import Dialog from '../../components/common/Dialog/Index.jsx';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import IconButton from '../../components/common/IconButton/IconButton.jsx';
import { versionTools } from '../../helpers/utils';
import {
  getUsersProjectList,
  getUserProjectInfo,
  patchUserProject,
  fetchMemberSuggestList,
  patchProjectMemeber,
  generateVersion,
  deleteProject,
  deletePorjectIcon,
  fetchAllVersions,
	compareProjectVersion,
} from '../../actions/project';
import {
  getIconDetail,
  editIconStyle,
} from '../../actions/icon';
import EditProject from './Edit.jsx';
import ManageMembers from './ManageMembers.jsx';
import Download from './Download.jsx';

@connect(
  state => ({
    usersProjectList: state.project.usersProjectList,
    currentUserProjectInfo: state.project.currentUserProjectInfo,
    suggestList: state.project.memberSuggestList,
    projectInfo: state.project.projectInfo,
    comparisonResult: state.project.comparisonResult,
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
    fetchAllVersions,
    compareProjectVersion,
    replace,
    getIconDetail,
    editIconStyle,
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
    fetchAllVersions: PropTypes.func,
    compareProjectVersion: PropTypes.func,
    patchUserProject: PropTypes.func,
    patchProjectMemeber: PropTypes.func,
    editIconStyle: PropTypes.func,
    getIconDetail: PropTypes.func,
    suggestList: PropTypes.array,
    projectInfo: PropTypes.object,
    comparisonResult: PropTypes.object,
    generateVersion: PropTypes.func,
    replace: PropTypes.func,
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
      showDownloadDialog: false,
      showHistoryVersion: false,
      isShowDownloadDialog: false,
      generateVersion: 'revision',
    };
    this.highestVersion = '0.0.0';
    this.nextVersion = '0.0.1';
  }
  componentDidMount() {
    this.props.getUsersProjectList().then(action => {
      const { organization } = action.payload.data;
      const id = this.props.params.id ? +this.props.params.id : '';
      const current = this.props.currentUserProjectInfo;
      if (!id && organization) {
        const [firstProject] = organization;
        if (firstProject && firstProject.id) {
          this.props.replace(`/user/projects/${firstProject.id}`);
        }
      }
      if (!current || id !== +current.id) {
        this.props.getUserProjectInfo(id);
        this.props.fetchAllVersions(id);
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
      this.props.replace(`/user/projects/${this.props.usersProjectList[0].id}`);
      return;
    }
    if (nextId !== this.props.params.id) {
      this.props.getUserProjectInfo(nextId);
      this.props.fetchAllVersions(nextId);
      this.highestVersion = '0.0.0';
      this.nextVersion = '0.0.1';
      this.props.compareProjectVersion(nextId, '0.0.0', '0.0.0');
    }
  }

  @autobind
  compareVersion(callback) {
    const id = this.props.params.id;
    const versions = this.props.projectInfo.versions;
    const high = versions[versions.length - 1];
    const low = '0.0.0';
    this.highestVersion = high;
    this.props.compareProjectVersion(id, high, low).then(callback);
  }

  @autobind
  handleSingleIconDownload(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.props.editIconStyle({ color: '#34475e', size: 255 });
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
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
  shiftDownloadDialog(isShow = false) {
    const length = this.props.projectInfo.versions.length;
    if (isShow && length > 1) {
      this.compareVersion(ret => {
        const { deleted, added } = ret.payload.data;
        if (deleted.length || added.length) {
          this.setState({
            showDownloadDialog: isShow,
          });
        } else {
          this.downloadAllIcons();
          return;
        }
      });
    } else {
      this.setState({
        showDownloadDialog: isShow,
      });
    }
  }

  @autobind
  shiftShowManageMembers(isShow = false) {
    this.setState({
      showManageMember: isShow,
    });
  }
  @autobind
  changeGenerateVersion(e) {
    const type = e.currentTarget.querySelector('input').value;
    this.setState({
      generateVersion: type,
    });
  }

  @autobind
  downloadAllIcons() {
    const { id } = this.props.params;
    axios
      .post('/api/download/font', { type: 'project', id })
      .then(({ data }) => {
        if (data.res) {
          window.location.href = `/download/${data.data}`;
        }
      });
  }

  @autobind
  downloadAndGenerateVersion() {
    // 生成版本
    this.props.generateVersion({
      id: this.props.currentUserProjectInfo.id,
      versionType: this.state.generateVersion,
    }).then(() => {
      // 下载字体
      this.downloadAllIcons();
    });
    // 关闭dialog
    this.shiftDownloadDialog();
  }
  renderIconList() {
    const current = this.props.currentUserProjectInfo;
    if (!current) return null;
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
          download={this.handleSingleIconDownload(item.id)}
        />
      ));
    }
    return iconList;
  }
  renderDialogList() {
    const current = this.props.currentUserProjectInfo;
    let dialogList = null;
    this.nextVersion = versionTools.update(this.highestVersion, this.state.generateVersion);
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
          id={current.id}
          ref={
            (node) => {
              this.ManageMembersEle = node;
            }
          }
        />,
        <Download
          key={3}
          currenthighestVersion={this.highestVersion}
          nextVersion={this.nextVersion}
          comparison={this.props.comparisonResult}
          onOk={this.downloadAndGenerateVersion}
          onCancel={this.shiftDownloadDialog}
          onChange={this.changeGenerateVersion}
          value={this.state.generateVersion}
          confrimText={'生成版本并下载'}
          showDownloadDialog={this.state.showDownloadDialog}
        />,
        <Dialog
          key={4}
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogUpdateShow}
        >
          <DownloadDialog />
        </Dialog>,
      ];
    }
    return dialogList;
  }
  render() {
    const list = this.props.usersProjectList;
    const current = this.props.currentUserProjectInfo;
    const id = this.props.params.id;
    const versions = this.props.projectInfo.versions;
    const iconList = this.renderIconList();
    const dialogList = this.renderDialogList();
    const owner = current.projectOwner || { name: '' };
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
              <header className="clearfix">
                <h3>{current.name}</h3>
                <div className="powerby">负责人：{owner.name}</div>
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
                <button
                  className="options-btns btns-blue"
                  onClick={() => { this.shiftDownloadDialog(true); }}
                >
                  <i className="iconfont">&#xf50a;</i>
                  下载全部图标
                </button>
                <Link
                  to={`/user/projects/${id}/logs`}
                  className="options-btns btns-default"
                >
                  操作日志
                </Link>
                <Link
                  to={`/user/projects/${id}/history`}
                  className={
                    `options-btns btns-default ${versions.length <= 1 ? 'btn-history-hidden' : ''}`
                  }
                >
                  历史版本
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
