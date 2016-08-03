import './edit.scss';
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import Select, { Option } from '../../components/common/Select';
import Dialog from '../../components/common/Dialog/Index';

class EditProject extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = Object.assign({}, props);
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
    const {
      projectName,
      owner,
      isPublic,
    } = this.state;
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
                  defaultValue={projectName}
                />
              </div>
            </li>
            <li className="field">
              <label htmlFor="project-author" className="field-label">项目管理员</label>
              <div className="field-set">
                <Select
                  className={"project-author"}
                  optionLabelProp="children"
                  optionFilterProp="text"
                  onChange={this.onOwnerChange}
                  value={owner.id}
                >
                  {this.props.members.map((item, index) => (
                    <Option value={item.id} text={item.name} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </div>
            </li>
            <li className="field">
              <label htmlFor="project-type" className="field-label">项目性质</label>
              <div className="field-set">
                <label>
                  <input
                    name="personal"
                    type="radio"
                    checked={!isPublic}
                    onChange={() => { this.onProjectTypeChange(false); }}
                  /> 私密
                </label>
                <label>
                  <input
                    name="public"
                    type="radio"
                    checked={isPublic}
                    onChange={() => { this.onProjectTypeChange(true); }}
                  />
                   公开
                </label>
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
