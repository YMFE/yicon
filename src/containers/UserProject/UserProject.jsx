import './UserProject.scss';
import axios from 'axios';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import { Link } from 'react-router';
import SliderSize from '../../components/SliderSize/SliderSize';
import confirm from '../../components/common/Dialog/Confirm.jsx';
import { replace } from 'react-router-redux';
import Dialog from '../../components/common/Dialog/Index.jsx';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import IconButton from '../../components/common/IconButton/IconButton.jsx';
import Loading from '../../components/common/Loading/Loading.jsx';
import { versionTools } from '../../helpers/utils';
import {
  getUsersProjectList,
  getUserProjectInfo,
  patchUserProject,
  fetchMemberSuggestList,
  patchProjectMemeber,
  generateVersion,
  deleteProject,
  deleteProjectIcon,
  fetchAllVersions,
	compareProjectVersion,
  adjustBaseline,
} from '../../actions/project';
import {
  getIconDetail,
  editIconStyle,
} from '../../actions/icon';
// import { resetIconSize } from '../../actions/repository';
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
    deleteProjectIcon,
    fetchAllVersions,
    compareProjectVersion,
    replace,
    getIconDetail,
    editIconStyle,
    adjustBaseline,
    // resetIconSize,
  }
)
class UserProject extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    usersProjectList: PropTypes.array,
    currentUserProjectInfo: PropTypes.object,
    getUsersProjectList: PropTypes.func,
    fetchMemberSuggestList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
    deleteProject: PropTypes.func,
    deleteProjectIcon: PropTypes.func,
    fetchAllVersions: PropTypes.func,
    compareProjectVersion: PropTypes.func,
    patchUserProject: PropTypes.func,
    patchProjectMemeber: PropTypes.func,
    editIconStyle: PropTypes.func,
    getIconDetail: PropTypes.func,
    // resetIconSize: PropTypes.func,
    suggestList: PropTypes.array,
    projectInfo: PropTypes.object,
    comparisonResult: PropTypes.object,
    generateVersion: PropTypes.func,
    replace: PropTypes.func,
    hideLoading: PropTypes.func,
    adjustBaseline: PropTypes.func,
  }

  static defaultProps ={
    generateVersion: 'revision',
    showLoading: false,
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
  componentWillMount() {
    this.setState({ showLoading: true });
    // this.props.resetIconSize();
    this.props.getUsersProjectList().then(() => {
      const id = this.props.projectId;
      const current = this.props.currentUserProjectInfo;
      if (!current || id !== +current.id) {
        this.props.getUserProjectInfo(id)
          .then(() => this.props.hideLoading())
          .catch(() => this.props.hideLoading());
        this.props.fetchAllVersions(id);
      }
      this.props.fetchMemberSuggestList();
      this.setState({ showLoading: false });
    }).catch(() => this.setState({ showLoading: false }));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ showLoading: true });
    const current = nextProps.currentUserProjectInfo;
    const nextId = nextProps.projectId;
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
      this.props.replace(`/projects/${this.props.usersProjectList[0].id}`);
      return;
    }
    if (nextId !== this.props.projectId) {
      this.props.getUserProjectInfo(nextId).then(() =>
        this.setState({ showLoading: false })
      ).catch(() => this.setState({ showLoading: false }));
      this.props.fetchAllVersions(nextId);
      this.highestVersion = '0.0.0';
      this.nextVersion = '0.0.1';
      this.props.compareProjectVersion(nextId, '0.0.0', '0.0.0');
    } else {
      this.setState({ showLoading: false });
    }
  }

  @autobind
  getIconsDom() {
    return findDOMNode(this.refs.iconsContainer).getElementsByClassName('Icon');
  }

  @autobind
  compareVersion(callback) {
    const id = this.props.projectId;
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
  deleteIcon(icons) {
    confirm({
      content: '确认从项目中删除图标吗？',
      title: '删除确认',
      onOk: () => {
        this.props.deleteProjectIcon(
          this.props.currentUserProjectInfo.id,
          [icons]
        );
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
  dialogUpdateShow(isShow) {
    this.setState({
      isShowDownloadDialog: isShow,
    });
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
    const id = this.props.projectId;
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
    const id = this.props.currentUserProjectInfo.id;
    this.props.generateVersion({
      id,
      versionType: this.state.generateVersion,
    }).then(() => {
      // 下载字体
      this.props.fetchAllVersions(id);
      this.downloadAllIcons();
    });
    // 关闭dialog
    this.shiftDownloadDialog();
  }

  @autobind
  adjustBaseline() {
    const { projectId, currentUserProjectInfo } = this.props;
    this.props.adjustBaseline(projectId, currentUserProjectInfo.baseline);
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
            this.deleteIcon(icons);
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
          owner={current.projectOwner}
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
    const id = this.props.projectId;
    const versions = this.props.projectInfo.versions;
    const iconList = this.renderIconList();
    const dialogList = this.renderDialogList();
    const owner = current.projectOwner || { name: '' };
    return (
      <div className="UserProject">
        <SubTitle tit="我的项目">
          <SliderSize getIconsDom={this.getIconsDom} />
        </SubTitle>
        <Content>
          <Menu>
            {
              list.map((item, index) => (
                <li
                  key={index}
                  data-id={item.id}
                  title={item.name}
                  className={
                    item.id === this.props.currentUserProjectInfo.id
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
                  <span
                    onClick={this.adjustBaseline}
                    title="调整基线后，图标将向下偏移，更适合跟中、英文字体对齐"
                    className="baseline-adjust"
                  >
                    {!current.baseline ?
                      <i className="iconfont">&#xf35f;</i> :
                      <i className="iconfont">&#xf496;</i>
                    }
                    调整基线
                  </span>
                </menu>
              : null
              }
              <div className="tool">
                <button
                  className="options-btns btns-blue"
                  onClick={() => { this.shiftDownloadDialog(true); }}
                >
                  <i className="iconfont">&#xf50b;</i>
                  下载全部图标
                </button>
                <Link
                  to={`/projects/${id}/logs`}
                  className="options-btns btns-default"
                >
                  操作日志
                </Link>
                <Link
                  to={`/projects/${id}/history`}
                  className={
                    `options-btns btns-default ${versions.length <= 1 ? 'btn-history-hidden' : ''}`
                  }
                >
                  历史版本
                </Link>
              </div>
            </div>
            <div className="clearfix icon-list" ref="iconsContainer">
              {iconList}
            </div>
          </Main>
        </Content>
        <Loading visible={this.state.showLoading} />
        {dialogList}
      </div>
    );
  }
}
export default UserProject;
