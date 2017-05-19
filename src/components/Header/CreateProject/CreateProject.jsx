import './CreateProject.scss';
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from '../../common/Dialog/Index';

class CreateProject extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({ projectName: '' }, props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({ ...nextProps });
    }
    if (this.props.showCreateProject !== nextProps.showCreateProject) {
      this.setState({
        projectName: '',
      });
    }
  }
  @autobind
  onProjectNameChange(e) {
    this.setState({
      projectName: e.target.value,
    });
  }

  getValue() {
    return {
      projectName: this.state.projectName,
    };
  }

  render() {
    return (
      <Dialog
        title="新建项目"
        extraClass="project-dialog"
        onOk={() => { this.props.createEmptyProject(this.getValue()); }}
        onCancel={() => { this.props.closeCreateProject(); }}
        visible={this.props.showCreateProject}
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
                  autoComplete="off"
                  placeholder="请输入新项目名称"
                />
              </div>
            </li>
          </ul>
        </form>
      </Dialog>
    );
  }
}

CreateProject.propTypes = {
  showCreateProject: PropTypes.bool,
  onProjectNameChange: PropTypes.func,
  id: PropTypes.number,
  createEmptyProject: PropTypes.func,
  closeCreateProject: PropTypes.func,
};
export default CreateProject;
