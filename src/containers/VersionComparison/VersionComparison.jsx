import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main, DesIcon } from '../../components/';
import Select from '../../components/common/Select/index';
import SliderSize from '../../components/SliderSize/SliderSize';
import { getAllProjects, getAllVersions, compareVersion } from '../../actions/versionComparison';

import './VersionComparison.scss';

const Option = Select.Option;

@connect(
  state => ({
    myProjects: state.user.versionComparison.myProjects,
    projectInfo: state.user.versionComparison.projectInfo,
    comparisonResult: state.user.versionComparison.comparisonResult,
    iconSize: state.repository.iconSize,
  }), { getAllProjects, getAllVersions, compareVersion }
)

export default class VersionComparison extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultVersion: '0.0.0',
      highVersion: '0.0.0',
      lowVersion: '0.0.0',
      version: '0.0.0',
    };
  }

  componentWillMount() {
    this.props.getAllProjects();
    this.props.getAllVersions(this.props.params.id);
  }

  v2n(version) {
    return version.split('.')
      .reduce((p, n, i) => p + n * Math.pow(1000, 2 - i), 0);
  }

  @autobind
  selectHighVersion(v) {
    this.setState({
      highVersion: v,
    });
  }

  @autobind
  selectLowVersion(v) {
    this.setState({
      lowVersion: v,
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
    this.props.compareVersion(this.props.params.id, _tempHigh, _tempLow);
  }

  render() {
    const deleteLength = this.props.comparisonResult.deleted.length;
    const addLength = this.props.comparisonResult.added.length;
    return (
      <div className="yicon-main yicon-myicon yicon-myiconvs">
        <div>
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
                    <a>{project.name}</a>
                  </li>
                ))
              }
            </Menu>
            <Main extraClass="yicon-myicon-main">
              <div className="myicon-prj-info">
                <div className="prj-details">
                  <div className="title">
                    <h3>{this.props.projectInfo.name} </h3>
                    <span className="tips">版本对比</span>
                    <a className="return" href="#">&gt;返回项目</a>
                  </div>
                </div>
                <div className="tools">
                  <Select
                    className="select-component"
                    defaultValue={this.state.defaultVersion}
                    style={{ width: 50, textIndent: 0, outline: 0 }}
                    onSelect={this.selectHighVersion}
                  >
                  {
                    this.props.projectInfo.versions.map((version, index) => (
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
                    defaultValue={this.state.defaultVersion}
                    style={{ width: 50, textIndent: 0 }}
                    onSelect={this.selectLowVersion}
                  >
                  {
                    this.props.projectInfo.versions.map((version, index) => (
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
                  <a
                    href="#"
                    className="options-btns btns-default"
                    onClick={this.diffVersion}
                  >版本对比</a>
                </div>
              </div>
              <div style={{ display: `${deleteLength || addLength ? 'block' : 'none'}` }}>
                <div className="yicon-myiconvs-title">
                  <i className="iconfont">&#xf513;</i>
                  <span> 高版本{this.state.version}删除了
                    <em className="count">{this.props.comparisonResult.deleted.length}</em>
                  个图标</span>
                </div>
                <div className="clearfix yicon-myiconvs-info">
                  <div className="icon-detail-item">
                  {
                    this.props.comparisonResult.deleted.map((icon, index) => (
                      <DesIcon
                        key={index}
                        className="info"
                        name={icon.name}
                        code={`&#${icon.code.toString(16)}`}
                        showCode
                        iconPath={icon.path}
                        iconSize={this.props.iconSize}
                      />
                    ))
                  }
                  </div>
                </div>
                <div className="yicon-myiconvs-title">
                  <i className="iconfont">&#xf515;</i>
                  <span> 高版本{this.state.version}增加了
                    <em className="count">{this.props.comparisonResult.added.length}</em>
                  个图标</span>
                </div>
                <div className="clearfix yicon-myiconvs-info">
                  <div className="icon-detail-item">
                  {
                    this.props.comparisonResult.added.map((icon, index) => (
                      <DesIcon
                        key={index}
                        className="info"
                        name={icon.name}
                        code={`&#${icon.code.toString(16)}`}
                        showCode
                        iconPath={icon.path}
                        iconSize={this.props.iconSize}
                      />
                    ))
                  }
                  </div>
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
  getAllProjects: PropTypes.func,
  getAllVersions: PropTypes.func,
  compareVersion: PropTypes.func,
  projectInfo: PropTypes.object,
  myProjects: PropTypes.arrayOf(PropTypes.string),
  comparisonResult: PropTypes.object,
  params: PropTypes.object,
  iconSize: PropTypes.number,
};
