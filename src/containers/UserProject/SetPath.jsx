import './edit.scss';
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import Dialog from '../../components/common/Dialog/Index';

class SetPath extends Component {

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
  onSourcePathChange(e) {
    this.setState({
      sourcePath: e.target.value,
    });
  }

  @autobind
  onCancel() {
    if (this.props.sourcePath !== this.state.sourcePath) {
      this.setState({ sourcePath: this.props.sourcePath });
    }
    this.props.onCancel();
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
        title="配置source路径"
        extraClass="project-dialog"
        onOk={() => { this.props.onOk(this.getValue()); }}
        onCancel={this.onCancel}
        visible={this.props.showSetPath}
      >
        <form className="project-form">
          <ul>
            <li className="field">
              <label htmlFor="project-name" className="field-label">路径</label>
              <div className="field-set">
                <input
                  type="text"
                  name="project-name"
                  className="project-name"
                  onChange={this.onSourcePathChange}
                  value={this.state.sourcePath}
                  placeholder={`请输入路径，例：${this.props.projectName}/fonts/`}
                  autoComplete="off"
                />
              </div>
            </li>
            <li className="field tips">
              <p>提示：例如在 gitlab 中的项目名称为 <code>finance</code>，字体文件的路径为 <code>score/font</code>，请填写
                <code>finance/score/font</code></p>。
              <p>我们会在此基础上按照版本号创建自路径，例如生成的 1.0.3 版本字体位置将会是
                <code>finance/score/font/1.0.3/fontname.ttf</code></p>。
            </li>
          </ul>
        </form>
      </Dialog>
    );
  }
}

SetPath.propTypes = {
  showSetPath: PropTypes.bool,
  onSourcePathChange: PropTypes.func,
  projectName: PropTypes.string,
  sourcePath: PropTypes.string,
  id: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};
export default SetPath;
