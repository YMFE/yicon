import './edit.scss';
import React, { PropTypes, Component } from 'react';
// import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
// import Select, { Option } from '../../components/common/Select';
import Select, { Option } from 'rc-select';
import Dialog from '../../components/common/Dialog/Index';

class ManageMembers extends Component {
  static propTypes = {
    showManageMember: PropTypes.bool,
    members: PropTypes.array,
    suggestList: PropTypes.array,
    fetchMemberSuggestList: PropTypes.func,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      members: this.props.members,
    };
  }
  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //
  //   })
  // }

  @autobind
  onChange(e) {
    const value = e.target.value;
    this.props.fetchMemberSuggestList(value);
  }
  @autobind
  onSelect(e) {
    this.setState({
      value: e,
    });
  }
  @autobind
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    this.state.suggestList.some((item, index, arr) => {
      if (item.id === id) {
        arr.splice(index, 1);
        this.setState({
          members: arr,
        });
        return true;
      }
      return false;
    });
  }
  getValue() {
    return {
      members: this.state.members,
    };
  }
  @autobind
  addNewMember() {
    const suggestList = this.props.suggestList;
    if (suggestList && suggestList.length === 0) {
      return;
    }
    const list = this.state.members;
    suggestList.some((item) => {
      if (+item.id === +this.state.value) {
        list.push(item);
        return true;
      }
      return false;
    });
    this.setState({
      members: list,
    });
  }
  render() {
    const suggestList = this.props.suggestList;
    const current = this.state.members;
    return (
      <Dialog
        title="编辑项目"
        extraClass="project-dialog"
        onOk={() => { this.props.onOk(this.getValue()); }}
        onCancel={() => { this.props.onCancel(); }}
        visible={this.props.showManageMember}
      >
        <form className="project-form">
          <ul>
            <li className="field">
              <div className="field-set">
              {
                suggestList && suggestList.length > 0 ?
                  <Select
                    placeholder="请输入需要添加成员域账号"
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    defaultActiveFirstOption={false}
                    value={this.state.value}
                    allowClear
                    combobox
                  >
                  {suggestList.map((item, index) => (
                    <Option key={index} value={item.id}>{item.name}</Option>
                  ))}
                  </Select> :
                  <input
                    type="text"
                    name="project-collaborators"
                    className="project-collaborators"
                    placeholder="请输入需要添加成员域账号"
                    onChange={this.onChange}
                    value={this.state.value}
                  />
              }
              </div>
              <div className="field-btn">
                <div type="button" className="add-collaborators" onClick={this.addNewMember}>
                  添加新成员
                </div>
              </div>
            </li>
          </ul>
          <div className="collaborators">
            <p className="collaborators-title">项目成员</p>
            <ul className="collaborators-list">
              {
                current && current.length > 0 && current.map((item, index) => (
                  <li data-id={item.id} key={index} onClick={this.onDelete}>
                    {item.name}
                    <i className="iconfont" title="删除成员">&#xf077;</i>
                  </li>
                ))
              }
            </ul>
          </div>
        </form>
      </Dialog>
    );
  }
}
export default ManageMembers;
