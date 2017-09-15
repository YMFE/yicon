import './ProjectList.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Loading from '../../components/common/Loading/Loading.jsx';
import { publicProjectList } from '../../actions/notification';
import { getUserProjectInfo, fetchAllVersions, fetchHistoryProject } from '../../actions/project';
import { DesIcon, SubTitle, Content, Menu, Main } from '../../components/';

@connect(
  (state) => ({
    publicList: state.user.notification.publicList,
    historyProject: state.project.historyProject,
  }),
  {
    publicProjectList,
    getUserProjectInfo,
    fetchAllVersions,
    fetchHistoryProject,
  }
)

class ProjectList extends Component {
  static propTypes = {
    publicProjectList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
    fetchAllVersions: PropTypes.func,
    fetchHistoryProject: PropTypes.func,
    params: PropTypes.object,
    id: PropTypes.number,
    publicList: PropTypes.array,
    historyProject: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      icons: [],
      publicName: '', // 公开项目名
      name: '', // 原始项目名
      active: '',
      version: '',
      admin: '',
      isShowLoading: true,
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    this.props.publicProjectList(2)
      .then(() => this.props.fetchAllVersions(id))
      .then((data) => {
        const version = data.payload.data.version || [];
        const length = Array.isArray(version) && version.length;
        this.props.fetchHistoryProject(id, version[length - 1]);
      })
      .then(() => {
        this.setState({
          isShowLoading: false,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const id = this.props.params.id;
    const nextId = nextProps.params.id;
    if (id !== nextId) {
      this.props.fetchAllVersions(nextId)
        .then((data) => {
          const version = data.payload.data.version || [];
          const length = Array.isArray(version) && version.length;
          this.props.fetchHistoryProject(id, version[length - 1]);
        });
    }
  }

  getIconImages() {
    const owner = this.getKeyCode();
    this.props.getUserProjectInfo(owner)
      .then(data => {
        this.setState({
          icons: data.payload.data.icons,
        });
        this.setState({
          isShowLoading: false,
        });
      });
  }

  setActive() {
    const id = this.getKeyCode();
    this.setState({
      active: id,
    });
  }

  getPublicTitle(data) {
    const id = this.state.active;
    data.forEach(v => {
      if (+id === v.id) {
        this.setState({
          publicName: v.publicName,
          name: v.name,
        });
      }
    });
  }

  getKeyCode() {
    return location.href.match(/\d+$/g)[0];
  }

  getAllVersions(id) {
    this.props.fetchAllVersions(id)
      .then(data => {
        const version = data.payload.data.version;
        this.setState({
          version: version[version.length - 1],
        });
      });
  }

  initPageData() {
    this.setActive();
    this.props.publicProjectList(2)
      .then(result => {
        const { active } = this.state;
        const data = result.payload.data;
        const jsx = [];
        data.forEach((v, k) => {
          const id = v.id;
          const value = +active === +id ? 'active' : '';
          jsx.push(
            <li className={value} key={k}>
              <Link to={`/projectlist/${id}`}>
                {v.name}
              </Link>
            </li>
          );
        });
        this.getAllVersions(data[0].id);
        this.getPublicTitle(data);
        this.getIconImages();
        this.setState({
          lists: jsx,
          admin: data[0].admin,
        });
      });
  }

  render() {
    const { publicList, historyProject } = this.props;
    const { id } = this.props.params;
    return (
      <section className="project-list">
        <SubTitle tit="公开项目" />
        <Content>
          <Menu>
            {
              publicList.map((item, index) => (
                <li
                  key={index}
                  data-id={item.id}
                  className={`project-name-item ${item.id === id
                    ? 'selected'
                    : null}`}
                >
                  <Link
                    to={`/projectlist/${item.id}`}
                  >
                      {item.name}
                  </Link>
                </li>
              ))
            }
          </Menu>
          <Main>
            <div className="icons">
              <h3>
                <span>公开项目名: {historyProject.publicName}</span>
                <span>(原始项目名: {historyProject.name})</span>
                <em>负责人: {historyProject.projectOwner && historyProject.projectOwner.name}</em>
                <em>版本: {historyProject.version}</em>
              </h3>
              <div className="clearfix myicon-list" ref="iconsContainer">
                {
                  historyProject.icons
                  && historyProject.icons.map((icon, index) => (
                    <div className="icon-detail-item" key={index}>
                      <DesIcon
                        name={icon.name}
                        code={`&#x${icon.code.toString(16)}`}
                        showCode
                        iconPath={icon.path}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </Main>
        </Content>
        <Loading visible={this.state.isShowLoading} />
      </section>
    );
  }
}

export default ProjectList;
