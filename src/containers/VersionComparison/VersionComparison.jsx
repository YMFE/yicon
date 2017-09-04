import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main, DesIcon } from '../../components/';
import Select from '../../components/common/Select/index';
import SliderSize from '../../components/SliderSize/SliderSize';
import { fetchAllProjects, fetchAllVersions, compareProjectVersion } from '../../actions/project';

import './VersionComparison.scss';

const Option = Select.Option;

@connect(
  state => ({
    myProjects: state.project.myProjects,
    projectInfo: state.project.projectInfo,
    comparisonResult: state.project.comparisonResult,
    // iconSize: state.repository.iconSize,
  }), { fetchAllProjects, fetchAllVersions, compareProjectVersion }
)

export default class VersionComparison extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultVersion: '0.0.0',
      highVersion: '0.0.0',
      lowVersion: '0.0.0',
      version: '0.0.0',
      leftVersion: '',
      rightVersion: '',
    };
  }

  componentWillMount() {
    const _tempHigh = this.state.defaultVersion;
    const _tempLow = this.state.defaultVersion;
    this.props.compareProjectVersion(this.props.params.id, _tempHigh, _tempLow);
    this.props.fetchAllProjects();
    this.props.fetchAllVersions(this.props.params.id).then(ret => {
      const version = ret.payload.data.version;
      this.setState({
        highVersion: version[version.length - 1],
        lowVersion: version[version.length - 1],
        leftVersion: version[version.length - 1],
        rightVersion: version[version.length - 1],
      });
    });
  }

  componentWillUnmount() {
    const _tempHigh = this.state.defaultVersion;
    const _tempLow = this.state.defaultVersion;
    this.props.compareProjectVersion(this.props.params.id, _tempHigh, _tempLow);
  }

  @autobind
  getIconsDom() {
    return findDOMNode(this.refs.iconsContainer).getElementsByClassName('Icon');
  }

  v2n(version) {
    return version.split('.')
      .reduce((p, n, i) => p + n * Math.pow(1000, 2 - i), 0);
  }

  @autobind
  selectHighVersion(v) {
    this.setState({
      highVersion: v,
      leftVersion: v,
    });
  }

  @autobind
  selectLowVersion(v) {
    this.setState({
      lowVersion: v,
      rightVersion: v,
    });
  }

  @autobind
  diffVersion() {
    const _tempHigh = this.state.highVersion;
    const _tempLow = this.state.lowVersion;
    const hVersion = this.v2n(_tempHigh);
    const lVersion = this.v2n(_tempLow);
    this.setState({
      version: _tempHigh,
    });
    if (hVersion < lVersion) {
      this.setState({
        version: _tempLow,
      });
    }
    this.props.compareProjectVersion(this.props.params.id, _tempHigh, _tempLow);
  }

  render() {
    const deleteLength = this.props.comparisonResult.deleted.length;
    const addLength = this.props.comparisonResult.added.length;
    const replacedLength = this.props.comparisonResult.replaced.length;
    const versions = this.props.projectInfo.versions.slice(1).reverse();
    return (
      <div className="yicon-main yicon-myicon yicon-myiconvs">
        <div ref="iconsContainer">
          <SubTitle tit={'我的图标项目'}>
            <SliderSize getIconsDom={this.getIconsDom} />
          </SubTitle>
          <Content>
            <Menu>
              {
                this.props.myProjects.organization.map((project, index) => (
                  <li
                    key={index}
                    className={+project.id === +this.props.params.id ? 'selected' : ''}
                  >
                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                  </li>
                ))
              }
            </Menu>
            <Main extraClass="yicon-myicon-main">
              <div className="myicon-prj-info">
                <div className="prj-details-comparison">
                  <div className="title">
                    <h3>{this.props.projectInfo.name} </h3>
                    <span className="tips">版本对比</span>
                    <Link
                      className="return"
                      to={`/projects/${this.props.params.id}`}
                    >
                      &gt;返回项目
                    </Link>
                  </div>
                </div>
                <div className="tools">
                  <Select
                    className="select-component"
                    value={this.state.leftVersion}
                    style={{ width: 60, textIndent: 0, outline: 0 }}
                    onSelect={this.selectHighVersion}
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
                  <i className="vs" style={{ float: 'left' }}>VS</i>
                  <Select
                    className="select-component"
                    value={this.state.rightVersion}
                    style={{ width: 60, textIndent: 0 }}
                    onSelect={this.selectLowVersion}
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
                  <button
                    className="options-btns btns-default"
                    onClick={this.diffVersion}
                  >版本对比</button>
                </div>
              </div>
              <div style={{ display: `${deleteLength ? 'block' : 'none'}` }}>
                <div className="yicon-myiconvs-title">
                  <i className="iconfont">&#xf513;</i>
                  <span> 高版本{this.state.version}删除了
                    <em className="count">{deleteLength}</em>
                  个图标</span>
                </div>
                <div className="clearfix yicon-myiconvs-info">
                  {
                    this.props.comparisonResult.deleted.map((icon, index) => (
                      <div className="icon-detail-item" key={index}>
                        <DesIcon
                          name={icon.name}
                          code={`&#x${icon.code.toString(16)}`}
                          showCode
                          iconPath={icon.path}
                          // iconSize={this.props.iconSize}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              <div style={{ display: `${addLength ? 'block' : 'none'}` }}>
                <div className="yicon-myiconvs-title">
                  <i className="iconfont">&#xf470;</i>
                  <span> 高版本{this.state.version}增加了
                    <em className="count">{addLength}</em>
                  个图标</span>
                </div>
                <div className="clearfix yicon-myiconvs-info">
                  {
                    this.props.comparisonResult.added.map((icon, index) => (
                      <div className="icon-detail-item" key={index}>
                        <DesIcon
                          name={icon.name}
                          code={`&#x${icon.code.toString(16)}`}
                          showCode
                          iconPath={icon.path}
                          // iconSize={this.props.iconSize}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              <div style={{ display: `${replacedLength ? 'block' : 'none'}` }}>
                <div className="yicon-myiconvs-title">
                  <i className="iconfont">&#xf515;</i>
                  <span> 高版本{this.state.version}替换了
                    <em className="count">{replacedLength}</em>
                  个图标</span>
                </div>
                <div className="clearfix yicon-myiconvs-info">
                  {
                    this.props.comparisonResult.replaced.map((icon, index) => (
                      <div className="options" key={index}>
                        <div className="icon-detail-item">
                          <DesIcon
                            name={icon.old.name}
                            code={`&#x${icon.old.code.toString(16)}`}
                            showCode
                            iconPath={icon.old.path}
                            // iconSize={this.props.iconSize}
                          />
                        </div>
                        <div className="operate-icon">
                          <i className="iconfont">&#xf0f8;</i>
                        </div>
                        <div className="icon-detail-item">
                          <DesIcon
                            name={icon.new.name}
                            code={`&#x${icon.new.code.toString(16)}`}
                            showCode
                            iconPath={icon.new.path}
                            // iconSize={this.props.iconSize}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div
                className="no-data"
                style={{ display: `${deleteLength || addLength ? 'none' : 'block'}` }}
              >
                <div>没有数据</div>
              </div>
            </Main>
          </Content>
        </div>
      </div>
    );
  }
}

VersionComparison.propTypes = {
  fetchAllProjects: PropTypes.func,
  fetchAllVersions: PropTypes.func,
  compareProjectVersion: PropTypes.func,
  projectInfo: PropTypes.object,
  myProjects: PropTypes.arrayOf(PropTypes.string),
  comparisonResult: PropTypes.object,
  params: PropTypes.object,
  // iconSize: PropTypes.number,
};
