import './edit.scss';
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import Select, { Option } from '../../components/common/Select';
import Dialog from '../../components/common/Dialog/Index';

class EditProject extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({ ...nextProps });
    }
  }
  @autobind
  onProjectNameChange(e) {
    this.setState({
      projectName: e.target.value,
    });
  }

  @autobind
  onProjectTypeChange(value) {
    this.setState({
      isPublic: value,
    });
  }

  @autobind
  onOwnerChange(e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    this.props.members.some(item => {
      if (item.id === value) {
        this.setState({
          owner: item,
        });
        return true;
      }
      return false;
    });
  }
  getValue() {
    return {
      ...this.state,
      id: this.props.id,
    };
  }
  render() {
    return (
      <Dialog
        title="编辑项目"
        extraClass="project-dialog"
        onOk={() => { this.props.onOk(this.getValue()); }}
        onCancel={() => { this.props.onCancel(); }}
        visible={this.props.showEditProject}
      >
        <form className="project-form">
          <ul>
            <li className="field">
              <label htmlFor="project-name" className="field-label">项目名称</label>
              <div className="field-set">
                <input
                  type="text"
                  name="project-name"
                  className="project-name"
                  onChange={this.onProjectNameChange}
                  value={this.state.projectName}
                  placeholder="请输入项目名称"
                />
              </div>
            </li>
            <li className="field">
              <label htmlFor="project-author" className="field-label">项目管理员</label>
              <div className="field-set">
                <Select
                  className="project-author"
                  optionLabelProp="children"
                  optionFilterProp="text"
                  onChange={this.onOwnerChange}
                  value={this.state.owner.id}
                >
                  {this.props.members.map((item, index) => (
                    <Option value={item.id} text={item.name} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </div>
            </li>
          </ul>
        </form>
      </Dialog>
    );
  }
}

EditProject.propTypes = {
  showEditProject: PropTypes.bool,
  onProjectTypeChange: PropTypes.func,
  onProjectNameChange: PropTypes.func,
  onOwnerChange: PropTypes.func,
  projectName: PropTypes.string,
  owner: PropTypes.object,
  isPublic: PropTypes.bool,
  members: PropTypes.array,
  id: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};
export default EditProject;
