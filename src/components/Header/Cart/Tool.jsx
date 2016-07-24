import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

class Tool extends Component {

  @autobind
  dumpIcon() {
    this.props.onDumpIcon();
  }
  @autobind
  saveToProject() {
    this.props.onSaveToProject();
  }
  @autobind
  changeCartSaveType(e) {
    const type = e.currentTarget.dataset.type;
    this.props.onChangeSaveType(type);
  }
  @autobind
  saveToNewProject() {
    const saveToProjectInput = this.saveToProjectInput.value;
    this.props.saveToNewProject(saveToProjectInput);
  }
  @autobind
  cancleSave() {
    this.props.onChangeSaveType('DEFAULT');
    this.props.onCancelSave(null, false);
  }
  @autobind
  download() {
    // TODO 下载
  }
  @autobind
  choseProjectForSave(e) {
    const target = e.currentTarget;
    const targetData = target.dataset;
    const project = {
      id: targetData.id,
      name: target.innerText,
    };
    this.props.onChoseProjectForSave(project);
  }

  render() {
    const { saveType, projectList } = this.props;
    switch (saveType) {
      case 'SAVE_TO_PROJECT':
        return (
          <div className="font-cdn save-to-old-pjc">
            <div className="font-project-name">
              <input
                type="text"
                placeholder="请选择项目"
                value={this.props.projectForSave && this.props.projectForSave.name}
              />
              <i className="iconfont">&#xf032;</i>
              <div className="save_to_pjc">
                <ul >
                  {
                    projectList.length > 0 ?
                    projectList.map((item, index) =>
                      (
                      <li
                        className="pjc-item"
                        key={index}
                        data-id={item.id}
                        onClick={this.choseProjectForSave}
                      >
                      {item.name}
                      </li>
                      )
                    ) :
                      <li className="pjc-item" />
                  }
                </ul>
              </div>
            </div>
            <a href="#" className="button-icon" onClick={this.saveToProject}>确定</a>
            <a href="#" className="button-icon button-cancel" onClick={this.cancleSave}>取消</a>
          </div>
        );
      case 'SAVE_TO_NEW_PROJECT':
        return (
          <div className="font-cdn">
            <div className="font-project-name">
              <input
                type="text"
                placeholder="请输入项目名称"
                ref={(node) => {
                  if (node) { this.saveToProjectInput = node; }
                }}
              />
              <i className="iconfont">&#xf032;</i>
            </div>
            <a href="#" className="button-icon" onClick={this.saveToProject}>确定</a>
            <a href="#" className="button-icon button-cancel">取消</a>
          </div>
        );
      default:
        return (
          <div className="save_ct">
            <div className="clear-car">
              <a href="#" onClick={this.dumpIcon}>清空</a>
            </div>
            <div className="btn-download">
              <div className="save_selection">
                <a
                  href="#"
                  className="ibtn"
                >
                  <span>保存为项目 <i className="iconfont">&#xf032;</i></span>
                </a>

                <div className="save_selection_btns">
                  <a
                    href="#"
                    className="ibtn"
                    onClick={this.changeCartSaveType}
                    data-type="SAVE_TO_NEW_PROJECT"
                  >
                    <span>保存为项目
                      <i className="iconfont">&#xf032;</i>
                    </span>
                  </a>
                  <div className="save-history">
                    <a
                      href="#"
                      className="ibtn"
                      data-type="SAVE_TO_PROJECT"
                      onClick={this.changeCartSaveType}
                    >
                    保存到已有项目
                    </a>
                  </div>
                </div>
              </div>
              <a
                href="#"
                className="ibtn ibtn-download"
                onClick={this.download}
              >
              下载
              </a>
            </div>
          </div>
      );
    }
  }
}

Tool.propTypes = {
  saveType: PropTypes.string,
  onDumpIcon: PropTypes.func,
  onChangeSaveType: PropTypes.func,
  onChoseProjectForSave: PropTypes.func,
  onSaveToProject: PropTypes.func,
  saveToNewProject: PropTypes.func,
  onCancelSave: PropTypes.func,
  projectList: PropTypes.array,
  projectForSave: PropTypes.oneOf([
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    PropTypes.Object,
  ]),
};

export default Tool;
