import './ProjectList.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { publicProjectList } from '../../actions/notification';
import { getUserProjectInfo } from '../../actions/project';
import { DesIcon, SubTitle } from '../../components/';
import SliderSize from '../../components/SliderSize/SliderSize';

@connect(
  () => ({}),
  {
    publicProjectList,
    getUserProjectInfo,
  }
)

class ProjectList extends Component {
  static propTypes = {
    publicProjectList: PropTypes.func,
    getUserProjectInfo: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      icons: [],
      title: '',
      active: '',
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
          title: v.name,
        });
      }
    });
  }

  getKeyCode() {
    return location.href.match(/\d+$/g)[0];
  }

  initPageData() {
    this.setActive();
    this.props.publicProjectList(2)
      .then(result => {
        const { active } = this.state;
        const data = result.payload.data;
        const jsx = [];

        data.forEach(v => {
          const id = v.id;
          const value = +active === +id ? 'active' : '';
          jsx.push(
            <li className={value}>
              <Link to={`/projectlist/${id}`}>
                {v.name}
              </Link>
            </li>
          );
        });
        this.getPublicTitle(data);
        this.getIconImages();
        this.setState({
          lists: jsx,
        });
      });
  }

  render() {
    const { lists, icons, title } = this.state;
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
            <h3>{title}</h3>
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
