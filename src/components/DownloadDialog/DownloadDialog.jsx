import './DownloadDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon, editIconStyle } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import { ICON_NAME, COLOR } from '../../constants/validate';
import Input from '../common/Input/Index.jsx';
import SetTag from '../common/SetTag/SetTag.jsx';
import Select from '../common/Select';
const Option = Select.Option;
import { autobind } from 'core-decorators';
import axios from 'axios';

@connect(
  state => ({
    suggestList: state.project.memberSuggestList,
    userInfo: state.user.info,
    iconDetail: state.icon,
  }),
  {
    editIcon,
    editIconStyle,
  }
)
class DownloadDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  @autobind
  showNameEdit() {
    this.setState({
      isEdit: true,
    });
  }
  validate(tags) {
    // tags必须为非空字符串
    return /\S+/.test(tags);
  }
  filter(tags) {
    // 过滤首尾空白字符
    return tags.replace(/^\s*|\s*$/g, '');
  }
  @autobind
  saveTags(tags) {
    const { iconDetail } = this.props;
    this.props.editIcon(iconDetail.id, { tags });
  }
  @autobind
  save(e) {
    if (e.type === 'click' || +e.keyCode === +13) {
      if (this.refs.myInput.isError()) {
        return;
      }
      const name = this.refs.myInput.getVal();
      if (this.validate(this.filter(name))) {
        this.props.editIcon(this.props.iconDetail.id, { name }).then(() => {
          this.setState({
            isEdit: false,
          });
          this.refs.myInput.reset();
        });
      }
    }
  }
  @autobind
  cancel() {
    this.setState({
      isEdit: false,
    });
    this.refs.myInput.reset();
  }

  @autobind
  changeIconColor(color, isError) {
    if (!isError) {
      this.props.editIconStyle({ color });
    }
  }

  @autobind
  changeIconSize(size) {
    this.props.editIconStyle({ size: +size });
  }

  tagsToArr(tags) {
    return tags.split(/[,| ]+/);
  }

  @autobind
  download(type) {
    const { id, iconStyle: { color, size } } = this.props.iconDetail;
    axios
      .post(`/api/download/icon/${type}`, { iconId: id, color, size })
      .then(ret => {
        const { res, data } = ret.data;
        if (res) {
          window.location.href = `/download/${data}`;
        }
      });
  }

  downloadSVG = this.download.bind(this, 'svg')
  downloadPNG = this.download.bind(this, 'png')

  render() {
    const { iconDetail, userInfo, type } = this.props;
    const repoId = iconDetail.repo.id;
    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (userInfo.login) {
      status = 2;
      if (userInfo.admin || userInfo.repoAdmin.indexOf(repoId) !== -1) {
        status = 3;
      }
    }
    const options = [32, 64, 128, 256].map((size, i) => (
      <Option
        value={`${size}`}
        className="select-narrow-menu"
        key={i}
      >
        {size}
      </Option>
    ));

    return (
      <div className="tan-container">
        <IconBgGrid
          bgSize={257}
          iconPath={iconDetail.path}
          iconSize={iconDetail.iconStyle.size}
          iconColor={iconDetail.iconStyle.color}
        />
        <div className="tan-detail">
          <div className={`tan-detail-header ${this.state.isEdit ? 'edit' : ''}`}>
            <div className="icon-name">
              <span className="icon-name-txt">{iconDetail.name}</span>
              <button
                className={`to-edit-name ${(+status === +3 && type === 'repo') ? '' : 'hide'}`}
                onClick={this.showNameEdit}
              >修改名称</button>
            </div>
            <div className="edit-name-box clearfix">
              <Input
                placeholder="请输入图标名称"
                defaultValue={iconDetail.name}
                extraClass="edit-name"
                keyDown={this.save}
                regExp={ICON_NAME.reg}
                errMsg={ICON_NAME.message}
                ref="myInput"
              />
              <button className="save" onClick={this.save}>保存</button>
              <button className="cancel" onClick={this.cancel}>取消</button>
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：{iconDetail.user.name}</span>&nbsp;&nbsp;
          </div>
          <SetTag
            disabled={+status === 1}
            onTagChange={this.saveTags}
            tags={iconDetail.tags || ''}
          />
          <div className="select-color clearfix">
            <ul className="color-list">
              {
                ['#1dba9c', '#26cb72', '#5aace2', '#9c58b6', '#34475e',
                '#f3c52d', '#e88027', '#ff5555', '#ecf0f1', '#a9b7b7'].map((color, index) => (
                  <li
                    className="color-item"
                    style={{ background: color }}
                    onClick={() => this.changeIconColor(color)}
                    key={index}
                  ></li>
                ))
              }
            </ul>
            <div className="color-select-box">
              <Input
                defaultValue={iconDetail.iconStyle.color}
                regExp={COLOR.reg}
                onChange={this.changeIconColor}
                strict
                ref="colorInput"
              />
              <div className="color-show" style={{ background: iconDetail.iconStyle.color }}></div>
            </div>
            <Select
              defaultValue="256"
              value={String(iconDetail.iconStyle.size)}
              onChange={this.changeIconSize}
              className="set-size"
            >
              {options}
            </Select>
          </div>
          <div className="download-box">
            <button className="download-btn" onClick={this.downloadSVG}>SVG下载</button>
            <button className="download-btn disabled" disabled>AI下载</button>
            <button className="download-btn" onClick={this.downloadPNG}>PNG下载</button>
          </div>
        </div>
      </div>
    );
  }
}

DownloadDialog.propTypes = {
  type: PropTypes.string,
  iconDetail: PropTypes.object,
  userInfo: PropTypes.object,
  editIcon: PropTypes.func,
  editIconStyle: PropTypes.func,
};

export default DownloadDialog;
