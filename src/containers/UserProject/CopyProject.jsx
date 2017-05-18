import './edit.scss';
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from '../../components/common/Dialog/Index';

class CopyProject extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({ projectName: '' }, props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({ ...nextProps });
    }
    if (this.props.showCopyProject !== nextProps.showCopyProject) {
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

  @autobind
  onOk() {
    this.props.onOk(this.getValue());
  }

  getValue() {
    return {
      id: this.props.id,
      projectName: this.state.projectName,
    };
  }

  render() {
    return (
      <Dialog
        title="拷贝生成新项目"
        extraClass="project-dialog"
        onOk={this.onOk}
        onCancel={() => { this.props.onCancel(); }}
        visible={this.props.showCopyProject}
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

CopyProject.propTypes = {
  showCopyProject: PropTypes.bool,
  onProjectNameChange: PropTypes.func,
  id: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};
export default CopyProject;
