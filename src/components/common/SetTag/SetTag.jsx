import './SetTag.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon } from '../../../actions/icon';
import Input from '../../common/Input/Index.jsx';
import { ICON_TAG } from '../../../constants/validate';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    iconDetail: state.icon,
  }),
  {
    editIcon,
  }
)
class SetTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.tags,
    });
  }

  validate(tags) {
    // tags必须为非空字符串
    return /\S+/.test(tags);
  }
  trim(tags) {
    // 过滤首尾空白字符或逗号
    return tags.replace(/^[\s|,]*|[\s|,]*$/g, '');
  }
  @autobind
  addTag(e, tag) {
    if (e.keyCode === 13) {
      const { tags } = this.state;
      const tagsTrim = this.trim(tag);
      if (this.validate(tagsTrim)) {
        let newTags = tags ? `${tags},${tagsTrim}` : tagsTrim;
        newTags = this.tagsToArr(newTags).join(',');
        this.setState({
          tags: newTags,
        });
        this.props.onTagChange(newTags);
      }
    }
  }

  // 模拟回车输入
  @autobind
  addTagByClick() {
    const inputEle = this.refs.myInput;
    const value = inputEle && typeof inputEle.getVal === 'function' && inputEle.getVal();
    this.addTag({ keyCode: 13 }, value || '');
  }

  deleteTag(tag) {
    const tagArr = this.tagsToArr(this.state.tags);
    if (tagArr.length > 1) {
      const index = tagArr.indexOf(tag);
      if (index !== -1) {
        tagArr.splice(index, 1);
      }
      const tags = tagArr.join(',');
      this.setState({
        tags,
      });
      this.props.onTagChange(tags);
    }
  }

  tagsToArr(tags) {
    return tags ? tags.split(/[\s|,]+/) : [];
  }

  render() {
    const { disabled } = this.props;
    const tagArr = this.tagsToArr(this.state.tags);
    const placeholder = disabled ? '登录可编辑' : '添加图标标签，回车提交，可多次提交';
    return (
      <div className="set-tag">
        <Input
          placeholder={placeholder}
          extraClass="edit-name"
          keyDown={this.addTag}
          regExp={ICON_TAG.reg}
          errMsg={ICON_TAG.message}
          ref="myInput"
          disabled={disabled}
        >
          {/* <i className="iconfont set-tag-icon">&#xf0ae;</i> */}
        </Input>
        <button className="add-tag" onClick={this.addTagByClick}>添加</button>
        <ul className="icon-tag-list">
          {
            tagArr.map((tag, index, arr) => (
              <li className="icon-tag" key={index}>
                <span>{tag}</span>
                <i
                  className={`iconfont delete ${arr.length <= 1 ? 'hide' : ''}`}
                  onClick={() => this.deleteTag(tag)}
                >&#xf077;</i>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

SetTag.defaultProps = {
  disabled: false,
  onTagChange: () => {},
  tags: '',
};

SetTag.propTypes = {
  onTagChange: PropTypes.func,
  tags: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SetTag;
