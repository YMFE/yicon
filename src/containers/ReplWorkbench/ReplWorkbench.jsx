import './ReplWorkbench.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import IconBgGrid from '../../components/common/IconBgGrid/IconBgGrid';
import Input from '../../components/common/Input/Index.jsx';
import SetTag from '../../components/common/SetTag/SetTag.jsx';
import {
  fetchCurrIcon,
  fetchReplaceIcon,
  replUpdateIcon,
  submitReplaceIcon,
} from '../../actions/replWorkbench.js';
import { uploadIcons } from '../../actions/workbench.js';
import { ICON_NAME } from '../../constants/validate';
import { push } from 'react-router-redux';
import Dialog from '../../components/common/Dialog/Index.jsx';
import { autobind } from 'core-decorators';

const defaultProps = {};
const propTypes = {
  userInfo: PropTypes.object,
  currIcon: PropTypes.object,
  repIcon: PropTypes.object,
  params: PropTypes.object,
  fetchCurrIcon: PropTypes.func,
  fetchReplaceIcon: PropTypes.func,
  replUpdateIcon: PropTypes.func,
  submitReplaceIcon: PropTypes.func,
  uploadIcons: PropTypes.func,
  push: PropTypes.func,
};

@connect(
  state => ({
    userInfo: state.user.info,
    currIcon: state.replWorkbench.currIcon,
    repIcon: state.replWorkbench.repIcon,
  }),
  {
    fetchCurrIcon,
    fetchReplaceIcon,
    replUpdateIcon,
    submitReplaceIcon,
    uploadIcons,
    push,
  }
)
export default class ReplWorkbench extends Component {

  state = {
    isShowDialog: false,
  }

  componentWillMount() {
    const { fromId, toId } = this.props.params;
    this.props.fetchCurrIcon(fromId);
    this.props.fetchReplaceIcon(toId);
  }

  @autobind
  blur(val) {
    const { currIcon } = this.props;
    currIcon.name = val;
    this.props.replUpdateIcon(Object.assign({}, currIcon));
  }

  @autobind
  saveTags(tags) {
    const { currIcon } = this.props;
    currIcon.tags = tags;
    this.props.replUpdateIcon(Object.assign({}, currIcon));
  }

  @autobind
  submitReplaceIcon() {
    // 库管超管直接替换
    const { params: { fromId, toId }, userInfo, currIcon } = this.props;
    if (userInfo.admin || userInfo.repoAdmin.indexOf(currIcon.repo.id) > -1) {
      this.props.submitReplaceIcon(fromId, toId, {
        name: currIcon.name,
        tags: currIcon.tags,
      }).then((data) => {
        if (data.payload.res) {
          this.setState({
            isShowDialog: false,
          });
          // this.props.push(`/repositories/${currIcon.repo.id}`);
          this.props.push(`/transition/repl-icon?repoId=${currIcon.repo.id}`);
        }
      });
    } else {
      // 普通上传者替换需要审核
      axios.get(`/api/icons/${toId}`).then(info => {
        const icon = info.data && info.data.data;
        icon.code = currIcon.code;
        icon.name = currIcon.name;
        icon.tags = currIcon.tags;
        icon.oldId = fromId;
        icon.fontClass = /-f$/g.test(`${icon.fontClass}`) ? '-f' : '-o';
        icon.isReplace = true;
        this.props.uploadIcons({
          repoId: currIcon.repo.id,
          icons: [icon],
        }).then(data => {
          if (data.payload.res) {
            this.setState({
              isShowDialog: false,
            });
            this.props.push(`/transition/replUpload-success?repoId=${currIcon.repo.id}`);
          }
        });
      });
    }
  }

  @autobind
  cancel() {
    this.setState({
      isShowDialog: false,
    });
  }

  @autobind
  submit() {
    this.setState({
      isShowDialog: true,
    });
  }

  @autobind
  dialogUpdateShow(isShow) {
    this.setState({
      isShowDownloadDialog: isShow,
    });
  }

  render() {
    const { currIcon, repIcon } = this.props;
    if (!currIcon.path || !repIcon.path) {
      return null;
    }
    return (
      <div className={'yicon-main yicon-upload replacement'}>
        <div className={'yicon-upload-container'}>
          <h2 className="upload-title">图标替换</h2>
          <div className={'upload-setting clearfix'}>
          {repIcon.path &&
            <IconBgGrid
              iconPath={repIcon.path}
            />
          }
            <div className="setting-opts">
              <div className="setting-opt">
                <label htmlFor="set-icon-name" className="set-opt-name">图标名称<span
                  className="require"
                >*</span></label>
                <Input
                  defaultValue={currIcon.name}
                  placeholder="请输入图标名称"
                  extraClass="edit-name"
                  blur={this.blur}
                  regExp={ICON_NAME.reg}
                  errMsg={ICON_NAME.message}
                  ref="myInput"
                />
              </div>
              <div className="setting-opt">
                <label htmlFor="set-icon-tag" className="set-opt-name">图标标签&nbsp;&nbsp;</label>
                <SetTag
                  onTagChange={this.saveTags}
                  tags={currIcon.tags}
                />
              </div>

            </div>
          </div>
          <div className="replace-submit">
            <button className="submit" onClick={this.submit}>提交替换</button>
          </div>
        </div>
        <Dialog
          title="图标替换"
          visible={this.state.isShowDialog}
          getShow={this.dialogUpdateShow}
          onOk={this.submitReplaceIcon}
          onCancel={this.cancel}
        >
          <div className="repl-tip">
            <div className="repl-old">旧图标</div>
            <div className="repl-new">新图标</div>
          </div>
          <div className="clearfix" style={{ width: 647 }}>
            {currIcon.path && <IconBgGrid iconPath={currIcon.path} />}
            <div className="replace-icon"><i className="iconfont repl-icon">&#xf0f8;</i></div>
            {repIcon.path && <IconBgGrid iconPath={repIcon.path} />}
          </div>
        </Dialog>
      </div>
    );
  }
}
ReplWorkbench.defaultProps = defaultProps;
ReplWorkbench.propTypes = propTypes;
