import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Menu, Main } from '../../components/';
import SliderSize from '../../components/SliderSize/SliderSize';
import Select from '../../components/common/Select/index';
import IconButton from '../../components/common/IconButton/IconButton.jsx';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import { fetchAllProjects, fetchAllVersions, getUserProjectInfo } from '../../actions/project';
import { getIconDetail, editIconStyle } from '../../actions/icon';

import './History.scss';

const Option = Select.Option;

@connect(
  state => ({
    myProjects: state.project.myProjects,
    currentUserProjectInfo: state.project.currentUserProjectInfo,
    projectInfo: state.project.projectInfo,
  }), {
    fetchAllProjects,
    fetchAllVersions,
    getUserProjectInfo,
    getIconDetail,
    editIconStyle,
  }
)

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDownloadDialog: false,
    };
  }

  componentWillMount() {
    this.props.fetchAllProjects();
    this.props.fetchAllVersions(this.props.params.id).then(ret => {
      const version = ret.payload.data.version;
      const length = version.length;
      this.props.getUserProjectInfo(this.props.params.id, version[length - 1]);
    });
  }

  @autobind
  onSelect(value) {
    this.props.getUserProjectInfo(this.props.params.id, value);
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
                this.props.currentUserProjectInfo.icons.map((v, index) => (
                  <IconButton
                    icon={v}
                    key={index}
                    toolBtns={['cart', 'copy', 'download', 'copytip']}
                    download={this.handleSingleIconDownload(v.id)}
                  />
                ))
              }
            </div>
          </Main>
        </Content>
        <Dialog
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogUpdateShow}
        >
          <DownloadDialog />
        </Dialog>
      </div>
    );
  }
}

History.propTypes = {
  params: PropTypes.object,
  fetchAllProjects: PropTypes.func,
  fetchAllVersions: PropTypes.func,
  getIconDetail: PropTypes.func,
  editIconStyle: PropTypes.func,
  getUserProjectInfo: PropTypes.func,
  myProjects: PropTypes.object,
  currentUserProjectInfo: PropTypes.object,
  projectInfo: PropTypes.object,
};
