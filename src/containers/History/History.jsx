import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
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
    // iconSize: state.repository.iconSize,
  }), {
    fetchAllProjects,
    fetchAllVersions,
    fetchHistoryProject,
  }
)

export default class History extends Component {

  static propTypes = {
    params: PropTypes.object,
    isHidden: PropTypes.bool,
    projectId: PropTypes.string,
    fetchAllProjects: PropTypes.func,
    fetchAllVersions: PropTypes.func,
    fetchHistoryProject: PropTypes.func,
    myProjects: PropTypes.object,
    historyProject: PropTypes.object,
    projectInfo: PropTypes.object,
    // iconSize: PropTypes.number,
    hideLoading: PropTypes.func,
  };

  static defaultProps = {
    isHidden: false,
    hideLoading: () => {},
  };

  state = {
    version: '',
  };

  componentWillMount() {
    const id = this.props.projectId || this.props.params.id;
    if (!this.props.isHidden) this.props.fetchAllProjects();
    this.props.fetchAllVersions(id).then(ret => {
      const version = ret.payload.data.version;
      const length = version.length;
      this.props.hideLoading();
      this.props.fetchHistoryProject(id, version[length - 1]);
      if (__CLIENT__) this.setState({ version: version[length - 1] });
    }).catch(() => {
      this.props.hideLoading();
    });
  }

  @autobind
  onSelect(value) {
    const id = this.props.projectId || this.props.params.id;
    this.props.fetchHistoryProject(id, value);
    this.setState({ version: value });
  }

  @autobind
  getIconsDom() {
    return findDOMNode(this.refs.iconsContainer).getElementsByClassName('Icon');
  }

  render() {
    const id = this.props.projectId || this.props.params.id;
    const versions = this.props.projectInfo.versions.slice(1).reverse();
    return (
      <div className="yicon-main yicon-myicon yicon-history">
        <SubTitle tit={this.props.isHidden ? '图标项目' : '我的图标项目'}>
          <SliderSize getIconsDom={this.getIconsDom} />
        </SubTitle>
        <Content>
          {
            !this.props.isHidden &&
              <Menu>
                {
                  this.props.myProjects.organization.map((project, index) => (
                    <li
                      key={index}
                      className={+project.id === +id ? 'selected' : ''}
                    >
                      <Link to={`/projects/${project.id}`}>{project.name}</Link>
                    </li>
                  ))
                }
              </Menu>
          }
          <Main extraClass="yicon-myicon-main">
            <div style={{ display: `${this.props.historyProject.name ? 'block' : 'none'}` }}>
              <div className="myicon-prj-info">
                <div className="prj-details-history">
                  <div className="title">
                    <h3>{this.props.projectInfo.name} </h3>
                    <span className="tips">{this.props.isHidden ? '' : '历史版本'}</span>
                    {
                      !this.props.isHidden &&
                        <Link
                          className="return"
                          to={`/projects/${id}`}
                        >
                          &lt;返回项目
                        </Link>
                    }
                  </div>
                </div>
                <div className="tools" style={{ display: `${versions.length ? 'block' : 'none'}` }}>
                  <div className="version">版本：</div>
                  <Select
                    className="select-component"
                    value={this.state.version}
                    style={{ width: 60, textIndent: 0, outline: 0 }}
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
                  {
                    !this.props.isHidden &&
                      <Link
                        to={`/projects/${id}/comparison`}
                        className="options-btns btns-default"
                      >
                        版本对比
                      </Link>
                  }
                </div>
                <div
                  className="tools"
                  style={{
                    color: '#f00',
                    display: `${!versions.length ? 'block' : 'none'}`,
                  }}
                >当前项目尚未生成稳定版本</div>
              </div>
              <div className="clearfix myicon-list" ref="iconsContainer">
                {
                  this.props.historyProject.icons.map((icon, index) => (
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
            <div
              className="empty-container"
              style={{ display: `${this.props.historyProject.name ? 'none' : 'block'}` }}
            ></div>
          </Main>
        </Content>
      </div>
    );
  }
}
