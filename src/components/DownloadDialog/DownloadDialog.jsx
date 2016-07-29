import './DownloadDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    userInfo: state.user.info,
    iconDetail: state.icon,
  }),
  {
    editIcon,
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
  @autobind
  addTag(e) {
    if (e.keyCode === 13) {
      const { iconDetail } = this.props;
      const value = e.target.value;
      const tags = `${iconDetail.tags},${value}`;
      this.props.editIcon(iconDetail.id, { tags });
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
  cancel() {
    this.setState({
      isEdit: false,
    });
  }

  tagsToArr(tags) {
    return tags.split(/[,| ]+/);
  }

  render() {
    const { iconDetail, userInfo } = this.props;
    const tagArr = this.tagsToArr(iconDetail.tags);
    const repoId = iconDetail.repo.id;

    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    let status = 1;
    if (userInfo.login) {
      status = 2;
      if (userInfo.admin && userInfo.repoAdmin.indexOf(repoId) !== -1) {
        status = 3;
      }
    }

    return (
      <div className="tan-container">
        <IconBgGrid size={257} icon={iconDetail} />
        <div className="tan-detail">
          <div className={`tan-detail-header ${this.state.isEdit ? 'edit' : ''}`}>
            <div className="icon-name">
              <span className="icon-name-txt">{iconDetail.name}</span>
              <button
                className={`to-edit-name ${+status === +3 ? '' : 'hide'}`}
                onClick={this.showNameEdit}
              >修改名称</button>
            </div>
            <div className="edit-name">
              <input type="text" className="input-name" />
              <button className="save" onClick={this.save}>保存</button>
              <button className="cancel" onClick={this.cancel}>取消</button>
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：{iconDetail.user.name}</span>&nbsp;&nbsp;
          </div>
          <div className="set-tag">
            <div className="set-input-wrap" onKeyDown={this.keydown}>
              <input
                className="set-input"
                type="text"
                id="set-icon-tag"
                placeholder="添加图标标签，回车提交，可多次提交"
                onKeyDown={this.addTag}
                disabled={+status === +1}
              />
              <i className="iconfont set-tag-icon">&#xf50f;</i>
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
              <li className="color-item" style={{ background: '#1dba9c' }}></li>
              <li className="color-item" style={{ background: '#26cb72' }}></li>
              <li className="color-item" style={{ background: '#5aace2' }}></li>
              <li className="color-item" style={{ background: '#9c58b6' }}></li>
              <li className="color-item" style={{ background: '#34475e' }}></li>
              <li className="color-item" style={{ background: '#f3c52d' }}></li>
              <li className="color-item" style={{ background: '#e88027' }}></li>
              <li className="color-item" style={{ background: '#ff5555' }}></li>
              <li className="color-item" style={{ background: '#ecf0f1' }}></li>
              <li className="color-item" style={{ background: '#a9b7b7' }}></li>
            </ul>
            <div className="color-select-box">
              <span>#ff5555</span>
              <div className="color-show"></div>
            </div>
            <div className="set-size">
              <span>64</span><i className="iconfont drop-down">&#xf032;</i>
            </div>
          </div>
          <div className="download-box">
            <button className="download-btn">SVG下载</button>
            <button className="download-btn">AI下载</button>
            <button className="download-btn">PNG下载</button>
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
};

export default DownloadDial;
