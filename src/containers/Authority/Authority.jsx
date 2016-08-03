import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main, Panel } from '../../components/';
import SearchList from '../../components/SearchList/SearchList';
import Pager from '../../components/common/Pager';
import Dialog from '../../components/common/Dialog/Index';

import {
  fetchAllRepo,
  fetchAllProject,
  updateRepoOwner,
  updateProjectOwner,
  createRepo,
  createProject,
  searchRepos,
  searchProjects,
} from '../../actions/admin';
import { fetchMemberSuggestList } from '../../actions/project';


import './Authority.scss';

@connect(
  state => ({
    repo: state.user.admin.repo,
    project: state.user.admin.project,
    page: state.user.admin.page,
    updateResult: state.user.admin.updateResult,
    suggestList: state.project.memberSuggestList,
  }), {
    fetchAllRepo,
    fetchAllProject,
    updateRepoOwner,
    updateProjectOwner,
    createRepo,
    createProject,
    searchRepos,
    searchProjects,
    fetchMemberSuggestList,
  }
)

export default class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateVisible: false,
      createVisible: true,
      ownerName: '',
      searchValue: '',
      isSearch: false,
      id: 0,
      name: '',
      alias: '',
      admin: '',
      owner: '',
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
        searchValue: '',
        name: '',
        alias: '',
        admin: '',
        owner: '',
        currentPage: 1,
      });
      this.fetchByType(nextProps.params.type, 1);
    }
  }

  fetchByType(type, page) {
    if (type === 'repo') {
      this.props.fetchAllRepo(page, 15);
    }
    if (type === 'project') {
      this.props.fetchAllProject(page, 15);
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
      });
    }
    if (type === 'project') {
      param.owner = this.state.owner;
      this.props.createProject(param).then(() => {
        this.fetchByType(type, this.state.currentPage);
      });
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

  @autobind
  updateOwner(id) {
    this.setState({
      updateVisible: true,
      createVisible: false,
      ownerName: '',
      id,
    });
  }

  @autobind
  closeUpdateDialog() {
    this.setState({
      updateVisible: false,
    });
  }

  @autobind
  handleUpdateChange(evt) {
    this.setState({
      ownerName: evt.target.value,
    });
  }

  @autobind
  ensureUpdate() {
    const type = this.props.params && this.props.params.type;
    const id = this.state.id;
    this.updateByType(type, id);
    this.setState({
      updateVisible: false,
    });
  }

  @autobind
  createRepoOrProject() {
    this.setState({
      updateVisible: false,
      createVisible: true,
      name: '',
      alias: '',
      admin: '',
      owner: '',
    });
  }

  @autobind
  closeCreateDialog() {
    this.setState({
      createVisible: false,
    });
  }

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
      case 'repo': {
        this.setState({
          admin: evt.target.value,
        });
        break;
      }
      case 'project': {
        this.setState({
          owner: evt.target.value,
        });
        break;
      }
      default:
        return;
    }
  }

  @autobind
  ensureCreate() {
    const type = this.props.params && this.props.params.type;
    this.createByType(type);
    this.setState({
      createVisible: false,
    });
  }

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

  @autobind
  handleSearchChange(evt) {
    this.setState({
      searchValue: evt.target.value,
    });
  }
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
  userChange(value) {
    this.props.fetchMemberSuggestList(value);
  }

  render() {
    const type = this.props.params && this.props.params.type;
    let btnName = '';
    let user = '';
    let data = [];
    let isShow = false;
    if (type === 'repo') {
      btnName = '大库';
      user = 'admin';
      data = this.props.repo || [];
      isShow = true;
    }
    if (type === 'project') {
      btnName = '项目';
      user = 'owner';
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
            </Menu>
            <Main extraClass="yicon-myicon-main">
              <div className="myicon-prj-right">
                <div className="yicon-authority-info">
                  <div className="tools">
                    <a
                      href="#"
                      className="options-btns btns-blue"
                      onClick={this.createRepoOrProject}
                    >新建{btnName}</a>
                    <div className="authority-search">
                      <input
                        type="text"
                        className="authority-input"
                        value={this.state.searchValue}
                        onChange={this.handleSearchChange}
                        placeholder="请输入大库或项目名称"
                      />
                      <a href="#" className="options-btns btns-blue" onClick={this.search}>搜索</a>
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
                <li className="dialog-item">
                  <div className="item-name">管理员</div>
                  <div className="dialog-input">
                    <input
                      type="text"
                      value={this.state.ownerName}
                      onChange={this.handleUpdateChange}
                      placeholder="请输入管理员名称"
                    />
                  </div>
                </li>
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
                  <div className="item-name">新建{btnName}</div>
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
                <li className="dialog-item">
                  <div className="item-name">管理员</div>
                  <div className="dialog-input">
                    <input
                      type="text"
                      value={this.state[user]}
                      data-type={`${type}`}
                    />
                  </div>
                </li>
                <SearchList
                  extraClass="dialog-input"
                  SuggestList={this.props.suggestList}
                  onChoseItem={this.userChange}
                  onChoseError={() => {}}
                  onChange={this.userChange}
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

Authority.propTypes = {
  params: PropTypes.object,
  fetchMemberSuggestList: PropTypes.func,
  fetchAllRepo: PropTypes.func,
  fetchAllProject: PropTypes.func,
  updateRepoOwner: PropTypes.func,
  updateProjectOwner: PropTypes.func,
  createRepo: PropTypes.func,
  createProject: PropTypes.func,
  searchRepos: PropTypes.func,
  searchProjects: PropTypes.func,
  suggestList: PropTypes.array,
  repo: PropTypes.array,
  project: PropTypes.array,
  page: PropTypes.object,
};
