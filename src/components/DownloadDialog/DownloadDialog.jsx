import './DownloadDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon, editIconStyle } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import Input from '../common/Input/Index.jsx';
import Select from '../common/Select/index';
const Option = Select.Option;
import { autobind } from 'core-decorators';
import axios from 'axios';

@connect(
  state => ({
    userInfo: state.user.info,
    iconDetail: state.icon,
  }),
  {
    editIcon,
    editIconStyle,
  }
)
class DownloadDial extends Component {

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
  addTag(e) {
    if (e.keyCode === 13) {
      const target = e.target;
      const { iconDetail } = this.props;
      const tag = target.value;
      if (this.validate(this.filter(tag))) {
        const tags = `${iconDetail.tags},${tag}`;
        this.props.editIcon(iconDetail.id, { tags }).then(() => {
          target.value = '';
        });
      }
    }
  }
  @autobind
  deleteTag(tag) {
    return () => {
      const { iconDetail } = this.props;
      const tagArr = this.tagsToArr(iconDetail.tags);
      tagArr.splice(tagArr.indexOf(tag), 1);
      const tags = tagArr.join(',');
      this.props.editIcon(iconDetail.id, { tags });
    };
  }
  @autobind
  save(e) {
    if (e.type === 'click' || +e.keyCode === +13) {
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
  changeIconColor(color) {
    return () => {
      this.props.editIconStyle({ color });
    };
  }

  @autobind
  changeIconSize(size) {
    this.props.editIconStyle({ size });
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
    const { iconDetail, userInfo } = this.props;
    const tagArr = this.tagsToArr(iconDetail.tags || '');
    const repoId = iconDetail.repo.id;
    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (userInfo.login) {
      status = 2;
      if (userInfo.repoAdmin.indexOf(repoId) !== -1 || userInfo.admin) {
        status = 3;
      }
    }
    const options = [];
    const setSizeArr = [16, 32, 64, 255];
    for (let i = 0, len = setSizeArr.length; i < len; i++) {
      options.push(
        <Option
          value={setSizeArr[i]}
          className={'select-narrow-menu'}
          key={i}
        >{setSizeArr[i]}</Option>
      );
    }

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
                className={`to-edit-name ${+status === +3 ? '' : 'hide'}`}
                onClick={this.showNameEdit}
              >修改名称</button>
            </div>
            <div className="edit-name-box clearfix">
              <Input
                placeholder="请输入图标名称"
                defaultValue={iconDetail.name}
                extraClass="edit-name"
                keyDown={this.save}
                regExp="\S+"
                errMsg="名字不能为空"
                ref="myInput"
              />
              <button className="save" onClick={this.save}>保存</button>
              <button className="cancel" onClick={this.cancel}>取消</button>
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：{iconDetail.user.name}</span>&nbsp;&nbsp;
          </div>
          <div className="set-tag">
            <div className="set-input-wrap">
              <input
                className="set-input"
                type="text"
                id="set-icon-tag"
                placeholder="添加图标标签，回车提交，可多次提交"
                onKeyDown={this.addTag}
                disabled={+status === +1}
              />
              <i className="iconfont set-tag-icon">&#xf0ae;</i>
            </div>
            <ul className="icon-tag-list">
              {
                tagArr.map((tag, index) => (
                  <li className="icon-tag" key={index}>
                    <span>{tag}</span>
                    <i className="iconfont delete" onClick={this.deleteTag(tag)}>&#xf077;</i>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="select-color clearfix">
            <ul className="color-list">
              {
                ['#1dba9c', '#26cb72', '#5aace2', '#9c58b6', '#34475e',
                '#f3c52d', '#e88027', '#ff5555', '#ecf0f1', '#a9b7b7'].map((color, index) => (
                  <li
                    className="color-item"
                    style={{ background: color }}
                    onClick={this.changeIconColor(color)}
                    key={index}
                  ></li>
                ))
              }
            </ul>
            <div className="color-select-box">
              <span>{iconDetail.iconStyle.color}</span>
              <div className="color-show" style={{ background: iconDetail.iconStyle.color }}></div>
            </div>
            <Select
              defaultValue={255}
              onChange={this.changeIconSize}
              className={'set-size'}
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

DownloadDial.propTypes = {
  iconDetail: PropTypes.object,
  userInfo: PropTypes.object,
  editIcon: PropTypes.func,
  editIconStyle: PropTypes.func,
};

export default DownloadDial;
