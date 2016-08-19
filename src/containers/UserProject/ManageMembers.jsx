import './edit.scss';
import React, { PropTypes, Component } from 'react';
// import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
// import Select, { Option } from '../../components/common/Select';
// import Select, { Option } from 'rc-select';
import Dialog from '../../components/common/Dialog/Index';
import SearchList from '../../components/SearchList/SearchList';

class ManageMembers extends Component {
  static propTypes = {
    id: PropTypes.number,
    showManageMember: PropTypes.bool,
    members: PropTypes.array,
    suggestList: PropTypes.array,
    fetchMemberSuggestList: PropTypes.func,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    owner: PropTypes.object,
  }
  static defaultProps ={
    members: [],
  }
  constructor(props) {
    super(props);
    this.members = this.props.members.slice(0);
    this.state = {
      value: '',
      members: this.members,
    };
  }
  // componentWillReceiveProps(nextProps) {
    // console.log(nextProps.suggestList);
  // }
  componentWillReceiveProps(props) {
    this.members = props.members.slice(0);
    this.setState({
      members: this.members,
    });
    // console.log(`this.members:${this.members}`);
  }
  componentDidUpdate() {
    if (this.props.showManageMember) {
      if (this.SearchList) this.SearchList.onShow();
    }
  }
  @autobind
  onChange(value) {
    this.props.onChange(value);
    this.setState({
      value,
    });
  }
  @autobind
  onSelect(e) {
    this.setState({
      value: e,
    });
  }
  getValue() {
    return {
      members: this.state.members,
    };
  }
  @autobind
  deleteMember(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    this.members.some((item, index) => {
      if (item.id === id) {
        this.members.splice(index, 1);
        return true;
      }
      return false;
    });
    this.setState({
      members: this.members.slice(0),
    });
  }
  @autobind
  addNewMember(item) {
    // console.log(`handle choseMembers${item}`);
    if (!item) {
      return;
    }
    const notExist = this.members.every(ite =>
      (ite.id !== parseInt(item.id, 10))
    );
    if (notExist) {
      this.members.push(item);
      this.setState({
        members: this.members.slice(0),
      });
    }
  }
  render() {
    const { members } = this.state;
    const { suggestList } = this.props;
    const { name } = this.props.owner;
    // console.log(`suggestList:${suggestList}`);
    // console.log(`members:${members}`);
    return (
      <Dialog
        title="成员管理"
        extraClass="project-dialog"
        onOk={() => { this.props.onOk(this.getValue()); }}
        onCancel={() => { this.props.onCancel(); }}
        visible={this.props.showManageMember}
      >
        <form className="project-form">
          <ul>
            <SearchList
              showSearchList={this.props.showManageMember}
              placeholder="请输入需要添加成员域账号"
              onChange={this.onChange}
              onChoseItem={this.addNewMember}
              suggestList={suggestList}
              ref={(node) => {
                if (node) this.SearchList = node;
              }}
            >
              <div className="field-btn">
                <button
                  type="button"
                  className="add-collaborators"
                  onClick={() => {
                    if (this.SearchList) {
                      this.SearchList.checkValue();
                      this.SearchList.clearInput();
                    }
                  }}
                >
                  添加新成员
                </button>
              </div>
            </SearchList>
          </ul>
          <div className="collaborators">
            <p className="collaborators-title">项目成员</p>
            <ul className="collaborators-list">
              {
                members.length > 0 && members.map((item, index) => (
                  <li
                    data-id={item.id}
                    key={index}
                    onClick={(e) => {
                      this.deleteMember(e);
                    }}
                    title={item.name === name ? '管理员' : ''}
                  >
                    {item.name === name && <i className="iconfont">&#xf50e;</i>}
                    {item.name}
                    {item.name !== name &&
                      <i className="iconfont pointer" title="删除成员">&#xf077;</i>
                    }
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
