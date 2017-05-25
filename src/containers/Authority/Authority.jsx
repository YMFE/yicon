import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main, Panel } from '../../components/';
import SearchList from '../../components/SearchList/SearchList';
import Pager from '../../components/common/Pager';
import Dialog from '../../components/common/Dialog/Index';
import Message from '../../components/common/Message/Message';
import confirm from '../../components/common/Dialog/Confirm.jsx';

import {
  fetchAllRepo,
  fetchAllProject,
  updateRepoOwner,
  updateProjectOwner,
  createRepo,
  searchRepos,
  searchProjects,
  fetchSuperManager,
  createSuperManager,
  deleteSuperManager,
} from '../../actions/admin';
import { fetchMemberSuggestList, createEmptyProject } from '../../actions/project';
import { fetchHomeData, fetchTinyRepository } from '../../actions/repository';

import './Authority.scss';

@connect(
  state => ({
    repo: state.user.admin.repo,
    project: state.user.admin.project,
    manager: state.user.admin.manager,
    page: state.user.admin.page,
    updateResult: state.user.admin.updateResult,
    suggestList: state.project.memberSuggestList,
    info: state.user.info,
  }), {
    fetchAllRepo,
    fetchAllProject,
    updateRepoOwner,
    updateProjectOwner,
    createRepo,
    createEmptyProject,
    searchRepos,
    searchProjects,
    fetchMemberSuggestList,
    fetchHomeData,
    fetchTinyRepository,
    fetchSuperManager,
    createSuperManager,
    deleteSuperManager,
  }
)

export default class Authority extends Component {

  static propTypes = {
    params: PropTypes.object,
    fetchMemberSuggestList: PropTypes.func,
    fetchAllRepo: PropTypes.func,
    fetchAllProject: PropTypes.func,
    updateRepoOwner: PropTypes.func,
    updateProjectOwner: PropTypes.func,
    createRepo: PropTypes.func,
    createEmptyProject: PropTypes.func,
    searchRepos: PropTypes.func,
    searchProjects: PropTypes.func,
    fetchHomeData: PropTypes.func,
    fetchTinyRepository: PropTypes.func,
    fetchSuperManager: PropTypes.func,
    createSuperManager: PropTypes.func,
    deleteSuperManager: PropTypes.func,
    suggestList: PropTypes.array,
    repo: PropTypes.array,
    project: PropTypes.array,
    manager: PropTypes.array,
    page: PropTypes.object,
    info: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      updateVisible: false,
      createVisible: false,
      disabledCodeVisible: false,
      ownerName: '',
      searchValue: '',
      isSearch: false,
      id: 0,
      name: '',
      alias: '',
      admin: '',
      owner: '',
      manager: '',
      currentPage: 1,
    };
  }

  componentWillMount() {
    const type = this.props.params && this.props.params.type;
    this.fetchByType(type, 1);
  }

  componentDidMount() {
    this.props.fetchMemberSuggestList('');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.type !== this.props.params.type) {
      this.setState({
        updateVisible: false,
        createVisible: false,
        disabledCodeVisible: false,
        searchValue: '',
        name: '',
        alias: '',
        admin: '',
        owner: '',
        manager: '',
        currentPage: 1,
      });
      this.fetchByType(nextProps.params.type, 1);
      this.superSearchList.clearInput();
    }
  }

  /* 统一处理根据type(repo/project)查询，修改，新建和搜索大库或者项目
  ** start
  */
  fetchByType(type, page) {
    if (type === 'repo') {
      this.props.fetchAllRepo(page, 15);
    }
    if (type === 'project') {
      this.props.fetchAllProject(page, 15);
    }
    if (type === 'manager') {
      this.props.fetchSuperManager();
    }
  }

  updateByType(type, id) {
    const param = { name: this.state.ownerName };
    if (type === 'repo') {
      this.props.updateRepoOwner(id, param).then(() => {
        this.fetchByType(type, this.state.currentPage);
      });
    }
    if (type === 'project') {
      this.props.updateProjectOwner(id, param).then(() => {
        this.fetchByType(type, this.state.currentPage);
      });
    }
  }

  createByType(type) {
    const param = Object.assign({}, { name: this.state.name });
    if (type === 'repo') {
      param.alias = this.state.alias;
      param.admin = this.state.admin;
      this.props.createRepo(param).then(() => {
        this.fetchByType(type, this.state.currentPage);
        this.props.fetchHomeData();
        this.props.fetchTinyRepository();
      });
    }
    if (type === 'project') {
      param.owner = this.state.owner;
      this.props.createEmptyProject(param).then(() => {
        this.fetchByType(type, this.state.currentPage);
      });
    }
    if (type === 'manager') {
      if (!this.state.manager) {
        Message.error('域名称缺少、不完整或错误，请检查');
        return;
      }
      this.props.createSuperManager(this.state.manager);
      this.setState({ manager: '' });
    }
  }

  searchByType(type, name, page = 1) {
    if (type === 'repo') {
      this.props.searchRepos(name, page, 15);
    }
    if (type === 'project') {
      this.props.searchProjects(name, page, 15);
    }
  }
  /* end */

  /* 更新管理员功能(项目、大库)
  ** start
  */
  // 打开dialog
  @autobind
  updateOwner(id) {
    this.updateSearchList.clearInput();
    this.setState({
      updateVisible: true,
      createVisible: false,
      ownerName: '',
      id,
    });
  }

  // 关闭dialog
  @autobind
  closeUpdateDialog() {
    this.setState({
      updateVisible: false,
    });
  }

  // 处理suggest，同步dialog中input输入的用户域账号对应的id
  @autobind
  handleUpdateChange(value) {
    this.props.fetchMemberSuggestList(value).then(() => {
      const data = this.props.suggestList;
      if (data.length === 1 && data[0].name === value) {
        this.setState({
          ownerName: data[0].name,
        });
      }
    });
  }

  // 提交数据，修改管理员
  @autobind
  ensureUpdate() {
    const type = this.props.params && this.props.params.type;
    const id = this.state.id;
    this.updateByType(type, id);
    this.setState({
      updateVisible: false,
    });
  }
  /* end */

  /* 新建大库/项目
  ** start
  */
  // 打开dialog
  @autobind
  createRepoOrProject() {
    this.createSearchList.clearInput();
    this.setState({
      updateVisible: false,
      createVisible: true,
      name: '',
      alias: '',
      admin: '',
      owner: '',
    });
  }

  // 关闭dialog
  @autobind
  closeCreateDialog() {
    this.setState({
      createVisible: false,
    });
  }

  // 处理dialog中非suggest的input输入
  @autobind
  handleCreateChange(evt) {
    switch (evt.target.dataset.type) {
      case 'name': {
        this.setState({
          name: evt.target.value,
        });
        break;
      }
      case 'alias': {
        this.setState({
          alias: evt.target.value,
        });
        break;
      }
      default:
        return;
    }
  }

  // 处理suggest，同步新建大库/项目时指定的用户id
  @autobind
  userChange(value) {
    this.props.fetchMemberSuggestList(value).then(() => {
      const data = this.props.suggestList;
      const type = this.props.params && this.props.params.type;
      if (data.length === 1 && data[0].name === value) {
        if (type === 'repo') {
          this.setState({
            admin: data[0].id,
          });
        }
        if (type === 'project') {
          this.setState({
            owner: data[0].id,
          });
        }
        if (type === 'manager') {
          this.setState({
            manager: data[0].id,
          });
        }
      }
    });
  }

  // 提交数据，新建大库或项目
  @autobind
  ensureCreate() {
    const type = this.props.params && this.props.params.type;
    this.createByType(type);
    this.setState({
      createVisible: false,
    });
  }
  /* end */

  // 翻页功能
  @autobind
  fetchDataByPage(page) {
    if (page === this.props.page.currentPage) return;
    const type = this.props.params && this.props.params.type;
    const { isSearch, searchValue } = this.state;
    if (isSearch && searchValue) {
      this.searchByType(type, searchValue, page);
    } else {
      this.fetchByType(type, page);
    }
    this.setState({
      currentPage: page,
    });
  }

  /* 搜索功能
  ** start
  */
  // 同步搜索框中的内容
  @autobind
  handleSearchChange(evt) {
    this.setState({
      searchValue: evt.target.value,
    });
  }

  // 搜索
  @autobind
  search() {
    const type = this.props.params && this.props.params.type;
    const searchValue = this.state.searchValue;
    if (searchValue) {
      this.searchByType(type, searchValue, 1);
      this.setState({
        isSearch: true,
      });
    } else {
      this.fetchByType(type, 1);
    }
  }

  @autobind
  searchByEnter(e) {
    if (e.keyCode === 13) {
      this.search();
    }
  }
  /* end */

  /* 超管增删管理
  * start
  */
  @autobind
  addSuperManager() {
    const { type } = this.props.params;
    this.createByType(type);
    this.superSearchList.clearInput();
  }

  @autobind
  removeSuperManager(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    confirm({
      content: '是否确定删除超管，请慎重操作！',
      title: '删除超管',
      onOk: () => {
        if (this.props.manager.length === 1) {
          Message.error('无法删除最后一位超管');
          return;
        }
        this.props.deleteSuperManager(id);
      },
      onCancel: () => {},
    });
  }

  @autobind
  showManagerItem(item, index) {
    const { name } = this.props.info || {};
    return this.props.manager.length === 1 || item.name === name ? (
      <li data-id={item.id} key={index}>{item.name}</li>
    ) : (
      <li
        data-id={item.id}
        key={index}
        onClick={this.removeSuperManager}
      >
        {item.name}
        <i className="iconfont pointer" title="删除超管">&#xf077;</i>
      </li>
    );
  }

  /* end */

  render() {
    const { type } = this.props.params;
    let btnName = '';
    let data = [];
    let isShow = false;
    if (type === 'repo') {
      btnName = '大库';
      data = this.props.repo || [];
      isShow = true;
    }
    if (type === 'project') {
      btnName = '项目';
      data = this.props.project || [];
      isShow = false;
    }
    return (
      <div className="yicon-main yicon-myicon yicon-authority">
        <div>
          <SubTitle tit={'权限设置'} />
          <Content>
            <Menu>
              <li className={type === 'repo' ? 'selected' : ''}>
                <Link to="/admin/authority/repo">大库权限设置</Link>
              </li>
              <li className={type === 'project' ? 'selected' : ''}>
                <Link to="/admin/authority/project">项目权限设置</Link>
              </li>
              <li className={type === 'manager' ? 'selected' : ''}>
                <Link to="/admin/authority/manager">超管增删管理</Link>
              </li>
            </Menu>
            <Main extraClass="yicon-myicon-main">
              <div
                className="myicon-prj-right"
                // style={{ display: `${type !== 'manager' ? 'block' : 'none'}` }}
                style={{ display: `${['repo', 'project'].indexOf(type) > -1 ? 'block' : 'none'}` }}
              >
                <div className="yicon-authority-info">
                  <div className="tools">
                    <button
                      className="options-btns btns-blue"
                      onClick={this.createRepoOrProject}
                    >新建{btnName}</button>
                    <div className="authority-search">
                      <input
                        type="text"
                        className="authority-input"
                        value={this.state.searchValue}
                        onChange={this.handleSearchChange}
                        placeholder="请输入大库或项目名称"
                        onKeyDown={this.searchByEnter}
                      />
                      <button className="options-btns btns-blue" onClick={this.search}>搜索</button>
                    </div>
                  </div>
                </div>
                <div className="yicon-authority-list">
                {
                  data.map((v, i) => (
                    <Panel
                      key={i}
                      type={type}
                      id={v.id}
                      panelName={v.name}
                      ownerName={v.ownerName}
                      onClick={this.updateOwner}
                    />
                  ))
                }
                </div>
                <div className="yicon-authority-pager">
                  {this.props.page.totalCount > this.props.page.pageSize &&
                    <Pager
                      defaultCurrent={this.props.page.currentPage}
                      onClick={this.fetchDataByPage}
                      totalPage={Math.ceil(this.props.page.totalCount / this.props.page.pageSize)}
                    />
                  }
                </div>
              </div>
              <div
                className="myicon-prj-right super-manager"
                style={{ display: `${type === 'manager' ? 'block' : 'none'}` }}
              >
                <div className="myicon-prj-info">
                  <div className="prj-details">
                    <div className="title">
                      <h3>超管增删管理</h3>
                    </div>
                  </div>
                  <div className="add-manager">
                    <ul className="clearfix">
                      <SearchList
                        showSearchList={this.props.suggestList.length > 0}
                        placeholder="请输入需要添加超管域账号"
                        onChange={this.userChange}
                        suggestList={this.props.suggestList}
                        ref={(node) => {
                          if (node) this.superSearchList = node;
                        }}
                      >
                        <div className="field-btn">
                          <button
                            type="button"
                            className="add-collaborators"
                            onClick={this.addSuperManager}
                          >
                            添加新超管
                          </button>
                        </div>
                      </SearchList>
                    </ul>
                  </div>
                </div>
                <div className="clearfix collaborators">
                  <p className="collaborators-title">超管列表</p>
                  <ul className="collaborators-list">
                    {
                      this.props.manager.length > 0 && this.props.manager.map((item, index) =>
                        this.showManagerItem(item, index)
                      )
                    }
                  </ul>
                </div>
              </div>
            </Main>
          </Content>
          <Dialog
            visible={this.state.updateVisible}
            title="更换管理员"
            onOk={this.ensureUpdate}
            onCancel={this.closeUpdateDialog}
          >
            <div className="authority-dialog">
              <ul>
                <SearchList
                  extraClass="dialog-input"
                  showSearchList={this.props.suggestList.length > 0}
                  suggestList={this.props.suggestList}
                  onChange={this.handleUpdateChange}
                  ref={(node) => {
                    if (node) this.updateSearchList = node;
                  }}
                >
                  <div className="item-name">管理员</div>
                </SearchList>
              </ul>
            </div>
          </Dialog>
          <Dialog
            visible={this.state.createVisible}
            title={`新建${btnName}`}
            onOk={this.ensureCreate}
            onCancel={this.closeCreateDialog}
          >
            <div className="authority-dialog" onChange={this.handleCreateChange}>
              <ul>
                <li className="dialog-item">
                  <div className="item-name">{btnName}名称</div>
                  <div className="dialog-input">
                    <input
                      type="text"
                      value={this.state.name}
                      data-type="name"
                      placeholder={`请输入${btnName}名称`}
                    />
                  </div>
                </li>
                <li className="dialog-item" style={{ display: `${isShow ? 'block' : 'none'}` }}>
                  <div className="item-name">别名</div>
                  <div className="dialog-input">
                    <input
                      type="text"
                      value={this.state.alias}
                      data-type="alias"
                    />
                  </div>
                </li>
                <SearchList
                  extraClass="dialog-input"
                  showSearchList={this.props.suggestList.length > 0}
                  suggestList={this.props.suggestList}
                  onChange={this.userChange}
                  ref={(node) => {
                    if (node) this.createSearchList = node;
                  }}
                >
                  <div className="item-name">管理员</div>
                </SearchList>
              </ul>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}
