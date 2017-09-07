import './ProjectList.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { publicProjectList } from '../../actions/notification';
import { getUserProjectInfo, fetchAllVersions } from '../../actions/project';
import { DesIcon, SubTitle } from '../../components/';
import SliderSize from '../../components/SliderSize/SliderSize';

@connect(
  () => ({}),
  {
    publicProjectList,
    getUserProjectInfo,
    fetchAllVersions,
  }
)

class ProjectList extends Component {
  static propTypes = {
    publicProjectList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
    fetchAllVersions: PropTypes.func,
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
    };
  }

  componentDidMount() {
    this.initPageData();
  }

  componentWillReceiveProps() {
    this.initPageData();
  }

  getIconImages() {
    const owner = this.getKeyCode();
    this.props.getUserProjectInfo(owner)
      .then(data => {
        this.setState({
          icons: data.payload.data.icons,
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
    const { lists, icons, publicName, name, version, admin } = this.state;
    return (
      <section className="project-list">
        <SubTitle tit="公共项目">
          <SliderSize getIconsDom={this.getIconsDom} />
        </SubTitle>
        <div className="box">
          <ul className="navs">
            {lists}
          </ul>
          <div className="icons">
            <h3>
              <span>公开项目名: {publicName}</span>
              <span>(原始项目名: {name})</span>
              <em>负责人: {admin}</em>
              <em>版本: {version}</em>
            </h3>
            <div className="clearfix myicon-list" ref="iconsContainer">
              {
                icons.map((icon, index) => (
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
        </div>
      </section>
    );
  }
}

export default ProjectList;
