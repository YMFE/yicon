import './UpdateDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { editIcon } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import { ICON_NAME } from '../../constants/validate';
import Input from '../common/Input/IndexUpdateDialog.jsx';
import SetTag from '../common/SetTag/SetTag.jsx';
import Message from '../../components/common/Message/Message';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    userInfo: state.user.info,
    iconDetail: state.icon,
    resetT: state.icon.resetT,
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
      inputValue: '',
      tagList: '',
      isOK: true,
      original: '', // 原始值
    };
  }

  componentDidMount() {
    this.refs.myInput.reset();
    document.body.addEventListener('click', e => this.editIcon(e));
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', e => this.editIcon(e));
  }

  @autobind
  setOriginalValue() {
    const { iconDetail } = this.props;
    this.setState({
      original: iconDetail.name,
    });
  }

  setTagList() {
    this.setState({
      tagList: '',
    });
  }

  @autobind
  setInputValue() {
    this.setState({
      inputValue: '',
    });
  }

  editIcon(e) {
    const el = e.target;
    const tagName = el.nodeName;
    if (tagName === 'svg' || tagName === 'path') {
      this.cancel(e);
    } else {
      const cls = el.className || '';
      const isSpan = cls.indexOf('js-icon-name-txt');
      const isInput = cls.indexOf('js-input');
      const isTag = cls.indexOf('js-add-tag');

      if (isSpan === -1 && isInput === -1 && isTag === -1) {
        this.cancel(e);
      }
    }
  }

  @autobind
  showNameEdit(isEdit, isOK, isTrue) {
    const noIconProject = !this.isIconProject();
    if (isTrue) {
      this.setState({
        isEdit,
        isOK,
      });
    } else {
      const id = this.props.currRepository.id;
      const { admin, repoAdmin } = this.props.userInfo;
      // 如果是超管 库管 可以编辑图标标题
      if ((admin || (repoAdmin && repoAdmin.includes(id))) && noIconProject) {
        this.setState({
          isEdit: true,
        });
      } else {
        return false;
      }
      this.setState({
        isOK,
      });
    }
    return true;
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
    this.props.editIcon(iconDetail.id, { tags }).then(result => {
      const data = result.payload;
      if (data && data.data) {
        this.props.resetT();
        this.setTagList();
        Message.success('编辑成功!');
      } else {
        Message.error(data.message);
      }
    });
  }

  @autobind
  addTags(newTags) {
    this.setState({
      tagList: newTags,
    });
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
            isOK: true,
          });
          this.refs.myInput.reset();
          this.setInputValue();
          Message.success('编辑成功!');
        });
      }
    }
  }

  @autobind
  cancel(e) {
    const el = e.target.nodeName;
    const newValue = this.refs.myInput.getVal();
    const fn = (isTrue) => {
      if (isTrue) {
        this.showNameEdit(false, true, true);
        this.setOriginalValue();
      }
      this.refs.myInput.reset();
    };
    const addValue = () => {
      // 如果有值 正常走流程
      if (newValue) {
        this.setState({
          // 控制input是否展现
          // isEdit: false,
          isEdit: true,
          inputValue: newValue,
        });
        this.refs.myInput.setVal(newValue);
        return false;
      }
      // 点击其他区域 如果没值 恢复原始值
      if (!newValue) {
        fn(true);
      }
      return false;
    };
    if (el === 'svg' || el === 'path') {
      addValue(newValue);
    } else {
      const isElClose = e.target.className.indexOf('js-iconfont');
      // 如果点击关闭按钮 恢复默认数据
      if (isElClose !== -1) {
        this.props.resetT();
        this.setTagList();
        this.setInputValue();
        fn(true);
        return false;
      }
      addValue(newValue);
    }
    return false;
  }

  // 是否在图标项目页面
  isIconProject() {
    const url = location.href;
    const reg = /projects$/img;
    return url.match(reg);
  }

  @autobind
  submit(e) {
    const { tagList, inputValue } = this.state;
    if (!tagList && !inputValue) {
      Message.error('编辑失败, 表单内容填写不完整!');
      return false;
    }
    if (tagList) {
      this.saveTags(this.state.tagList);
    }
    if (inputValue) {
      this.save(e);
    }
    return true;
  }

  render() {
    const { iconDetail, userInfo } = this.props;
    const repoId = iconDetail.repo.id;
    const value = this.state.isOK ? iconDetail.name : this.state.inputValue;
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
          bgSize={256}
          iconPath={iconDetail.path}
          iconSize={iconDetail.iconStyle.size}
          iconColor={iconDetail.iconStyle.color}
        />
        <div className="update-icon-detail">
          <div
            className={`update-detail-header ${this.state.isEdit ? 'edit' : ''}`}
            onClick={() => this.showNameEdit(true, false)}
          >
            <div className="icon-name">
              <span className="icon-name-txt js-icon-name-txt" onClick={this.setOriginalValue}>
                {value}
              </span>
            </div>
            <div className="edit-name-box clearfix">
              <Input
                placeholder="请输入图标名称"
                defaultValue={value}
                extraClass="edit-name"
                regExp={ICON_NAME.reg}
                errMsg={ICON_NAME.message}
                ref="myInput"
                setInputValue={this.setInputValue}
              />
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：{iconDetail.user.name}</span>&nbsp;&nbsp;
          </div>
          <SetTag
            disabled={+status === 1}
            onTagChange={this.addTags}
            tags={iconDetail.tags || ''}
            setInputValue={this.setInputValue}
          />

          <button className="options-btns-ok" onClick={this.submit}>
            确定
          </button>
        </div>
      </div>
    );
  }
}

UpdateDialog.propTypes = {
  type: PropTypes.string,
  iconDetail: PropTypes.object,
  userInfo: PropTypes.object,
  currRepository: PropTypes.object,
  editIcon: PropTypes.func,
  resetT: PropTypes.func,
};

export default UpdateDialog;
