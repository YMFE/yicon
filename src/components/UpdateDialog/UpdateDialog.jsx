import './UpdateDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import { ICON_NAME } from '../../constants/validate';
import Input from '../common/Input/Index.jsx';
import SetTag from '../common/SetTag/SetTag.jsx';
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
class UpdateDialog extends Component {

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

    return (
      <div className="update-icon-container">
        <IconBgGrid
          bgSize={257}
          iconPath={iconDetail.path}
          iconSize={iconDetail.iconStyle.size}
          iconColor={iconDetail.iconStyle.color}
        />
        <div className="update-icon-detail">
          <div className={`update-detail-header ${this.state.isEdit ? 'edit' : ''}`}>
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
        </div>
      </div>
    );
  }
}

UpdateDialog.propTypes = {
  type: PropTypes.string,
  iconDetail: PropTypes.object,
  userInfo: PropTypes.object,
  editIcon: PropTypes.func,
};

export default UpdateDialog;
