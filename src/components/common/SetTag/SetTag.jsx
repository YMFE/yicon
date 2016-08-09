import './SetTag.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon } from '../../../actions/icon';
import Input from '../../common/Input/Index.jsx';
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
  filter(tags) {
    // 过滤首尾空白字符
    return tags.replace(/^\s*|\s*$/g, '');
  }
  @autobind
  addTag(e, tag) {
    // if (e.keyCode === 13) {
    //   const target = e.target;
    //   const { iconDetail } = this.props;
    //   const tag = target.value;
    //   if (this.validate(this.filter(tag))) {
    //     const tags = iconDetail.tags ? `${iconDetail.tags},${tag}` : tag;
    //     this.props.editIcon(iconDetail.id, { tags }).then(() => {
    //       target.value = '';
    //       this.props.afterAdd();
    //     });
    //   }
    // }
    if (e.keyCode === 13) {
      const { tags } = this.state;
      const tagsTrim = this.filter(tag);
      if (this.validate(tagsTrim)) {
        const newTags = tags ? `${tags},${tagsTrim}` : tagsTrim;
        this.setState({
          tags: newTags,
        });
        this.props.onTagChange(newTags);
      }
    }
  }

  deleteTag(tag) {
    // return () => {
    //   const { iconDetail } = this.props;
    //   const tagArr = this.tagsToArr(iconDetail.tags);
    //   tagArr.splice(tagArr.indexOf(tag), 1);
    //   const tags = tagArr.join(',');
    //   this.props.editIcon(iconDetail.id, { tags }).then(() => {
    //     this.props.afterDelete();
    //   });
    // };
    const tagArr = this.tagsToArr(this.state.tags);
    if (tagArr.length > 1) {
      tagArr.splice(tagArr.indexOf(tag), 1);
      const tags = tagArr.join(',');
      this.setState({
        tags,
      });
      this.props.onTagChange(tags);
    }
  }

  tagsToArr(tags) {
    return tags ? tags.split(/[,| ]+/) : [];
  }

  render() {
    const { disabled } = this.props;
    const tagArr = this.tagsToArr(this.state.tags);
    return (
      <div className="set-tag">
        <Input
          placeholder="添加图标标签，回车提交，可多次提交"
          extraClass="edit-name"
          keyDown={this.addTag}
          regExp="\S+"
          errMsg="tag不能为空"
          ref="myInput"
          disabled={disabled}
        >
          <i className="iconfont set-tag-icon">&#xf0ae;</i>
        </Input>
        <ul className="icon-tag-list">
          {
            tagArr.map((tag, index) => (
              <li className="icon-tag" key={index}>
                <span>{tag}</span>
                <i className="iconfont delete" onClick={() => this.deleteTag(tag)}>&#xf077;</i>
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
