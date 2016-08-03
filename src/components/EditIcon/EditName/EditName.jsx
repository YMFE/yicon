import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIcon } from '../../../actions/icon';
// import Input from '../../common/Input/Index.jsx';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    iconDetail: state.icon,
  }),
  {
    editIcon,
  }
)
class EditName extends Component {

  validate(name) {
    // name必须为非空字符串
    return /\S+/.test(name);
  }
  filter(name) {
    // 过滤首尾空白字符
    return name.replace(/^\s*|\s*$/g, '');
  }
  // @autobind
  // save(e) {
  //   if (e.type === 'click' || +e.keyCode === +13) {
  //     const name = this.refs.myInput.getVal();
  //     if (this.validate(this.filter(name))) {
  //       this.props.editIcon(this.props.iconDetail.id, { name }).then(() => {
  //         // this.setState({
  //         //   isEdit: false,
  //         // });
  //         // this.refs.myInput.reset();
  //         this.props.afterChange();
  //       });
  //     }
  //   }
  // }
  @autobind
  // blur(val) {}

  render() {
    return <div>dfd</div>;
    // const { disabled, value } = this.props;
    // return (
    //   <Input
    //     defaultValue={value}
    //     placeholder="请输入图标名称"
    //     extraClass="edit-name"
    //     keyDown={this.save}
    //     blur={this.blur}
    //     regExp="\S+"
    //     errMsg="名字不能为空"
    //     ref="myInput"
    //     disabled={disabled}
    //   />
    // );
  }
}

EditName.defaultProps = {
  disabled: false,
};

EditName.propTypes = {
  iconDetail: PropTypes.object,
  editIcon: PropTypes.func,
  afterChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default EditName;
