import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main, DesIcon } from '../../components/';
import SliderSize from '../../components/SliderSize/SliderSize';
import Select from '../../components/common/Select/index';
import { fetchAllProjects, fetchAllVersions, fetchHistoryProject } from '../../actions/project';

import './History.scss';

const Option = Select.Option;

@connect(
  state => ({
    myProjects: state.project.myProjects,
    historyProject: state.project.historyProject,
    projectInfo: state.project.projectInfo,
    iconSize: state.repository.iconSize,
  }), {
    fetchAllProjects,
    fetchAllVersions,
    fetchHistoryProject,
  }
)

export default class History extends Component {
  componentWillMount() {
    this.props.fetchAllProjects();
    this.props.fetchAllVersions(this.props.params.id).then(ret => {
      const version = ret.payload.data.version;
      const length = version.length;
      this.props.fetchHistoryProject(this.props.params.id, version[length - 1]);
    });
  }

  @autobind
  onSelect(value) {
    this.props.fetchHistoryProject(this.props.params.id, value);
  }

  render() {
    const id = this.props.params.id;
    const versions = this.props.projectInfo.versions.slice(1).reverse();
    return (
      <div className="yicon-main yicon-myicon yicon-history">
        <SubTitle tit={'我的图标项目'}>
          <SliderSize />
        </SubTitle>
        <Content>
          <Menu>
            {
              this.props.myProjects.organization.map((project, index) => (
                <li
                  key={index}
                  className={+project.id === +this.props.params.id ? 'selected' : ''}
                >
                  <Link to={`/user/projects/${project.id}`}>{project.name}</Link>
                </li>
              ))
            }
          </Menu>
          <Main extraClass="yicon-myicon-main">
            <div className="myicon-prj-info">
              <div className="prj-details">
                <div className="title">
                  <h3>{this.props.projectInfo.name} </h3>
                  <span className="tips">历史版本</span>
                  <Link
                    className="return"
                    to={`/user/projects/${this.props.params.id}`}
                  >
                    &lt;返回项目
                  </Link>
                </div>
              </div>
              <div className="tools">
                <div className="version">版本：</div>
                <Select
                  className="select-component"
                  defaultValue={versions[0]}
                  style={{ width: 50, textIndent: 0, outline: 0 }}
                  onSelect={this.onSelect}
                >
                {
                  versions.map((version, index) => (
                    <Option
                      key={index}
                      value={version}
                      className="version-item"
                    >
                      {version}
                    </Option>
                  ))
                }
                </Select>
                <Link
                  to={`/user/projects/${id}/comparison`}
                  className="options-btns btns-default"
                >
                  版本对比
                </Link>
              </div>
            </div>
            <div className="clearfix myicon-list">
              {
                this.props.historyProject.icons.map((icon, index) => (
                  <div className="icon-detail-item" key={index}>
                    <DesIcon
                      name={icon.name}
                      code={`&#x${icon.code.toString(16)}`}
                      showCode
                      iconPath={icon.path}
                      iconSize={this.props.iconSize}
                    />
                  </div>
                ))
              }
            </div>
          </Main>
        </Content>
      </div>
    );
  }
}

History.propTypes = {
  params: PropTypes.object,
  fetchAllProjects: PropTypes.func,
  fetchAllVersions: PropTypes.func,
  fetchHistoryProject: PropTypes.func,
  myProjects: PropTypes.object,
  historyProject: PropTypes.object,
  projectInfo: PropTypes.object,
  iconSize: PropTypes.number,
};
