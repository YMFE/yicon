import './Audit.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';import {
  fetchAuditIcons,
  updateAuditIcons,
  auditIcons,
  selectIcon,
} from '../../actions/audit.js';
import IconsSetting from '../../components/common/IconsSetting/IconsSetting.jsx';
import { autobind } from 'core-decorators';

const defaultProps = {};
const propTypes = {
  index: PropTypes.number,
  icons: PropTypes.array,
  fetchAuditIcons: PropTypes.func,
  updateAuditIcons: PropTypes.func,
  auditIcons: PropTypes.func,
  selectIcon: PropTypes.func,
};
@connect(
  state => ({
    icons: state.audit.icons,
    index: state.audit.selcIndex,
  }),
  {
    fetchAuditIcons,
    updateAuditIcons,
    auditIcons,
    selectIcon,
  }
)
export default class Audit extends Component {
  componentWillMount() {
    this.props.fetchAuditIcons();
  }

  @autobind
  select(index) {
    this.props.selectIcon(index);
  }

  @autobind
  delete(icons, index) {
    this.props.selectIcon(index);
    this.props.updateAuditIcons(icons);
  }

  @autobind
  turnLeft(index) {
    // const { index } = this.props;
    // const newIndex = index - 1 < 0 ? 0 : index - 1;
    this.props.selectIcon(index);
  }

  @autobind
  turnRight(index) {
    // const { index, icons } = this.props;
    // const newIndex = index >= icons.length ? index : index + 1;
    this.props.selectIcon(index);
  }

  @autobind
  updateIcons(icons) {
    this.props.updateAuditIcons(icons);
  }

  @autobind
  auditIcon(isPass) {
    const { index, icons } = this.props;
    icons[index].passed = isPass;
    this.props.updateAuditIcons(icons.concat());
  }

  @autobind
  auditIconsSubmit() {
    const { icons } = this.props;
    // path需要吗
    const newIcons = icons.map((icon) => (
      {
        id: icon.id,
        fontClass: icon.fontClass,
        name: icon.name,
        tags: icon.tags,
        passed: icon.passed,
      }
    ));
    this.props.auditIcons(newIcons);
  }

  // @autobind
  // AuditIcons() {
  //   const icons = this.calcDone();
  //   this.props.uploadIcons({
  //     repoId: this.props.repoId,
  //     icons,
  //   }).then(() => {
  //     const noDone = this.props.icons.filter((icon) => (
  //       !(icon.name && icon.fontClass)
  //     ));
  //     if (!noDone.length) {
  //       this.props.push('/upload');
  //     } else {
  //       this.props.updateAudit(noDone);
  //     }
  //   });
  // }
  //
  // @autobind
  // showUploadDialog() {
  //   const doneNum = this.calcDone().length;
  //   const title = '提交上传';
  //   const content = `还有${this.props.icons.length - doneNum}枚图标未设置完成，确认上传设置完成的${doneNum}枚图标吗？`;
  //   dialog({
  //     title,
  //     content,
  //     onOk: this.uploadIcons,
  //   });
  // }

  render() {
    const { index, icons } = this.props;
    if (!icons.length) {
      return null;
    }
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-audit-container'}>
          <IconsSetting
            title="图标审核"
            icons={icons}
            index={index}
            onClick={this.select}
            onDelete={this.delete}
            saveName={this.updateIcons}
            selectStyle={this.updateIcons}
            saveTags={this.updateIcons}
            turnLeft={this.turnLeft}
            turnRight={this.turnRight}
            isAudit
          />
          <div className="approval">
            <button
              className="aprv-btn pass"
              onClick={() => this.auditIcon(true)}
            >审核通过</button>
            <button
              className="aprv-btn no-pass"
              onClick={() => this.auditIcon(false)}
            >审核不通过</button>
          </div>
          <div className="approval-submit">
            <button className="submit" onClick={this.auditIconsSubmit}>提交已通过审核图标生成字体</button>
          </div>
        </div>
      </div>
    );
  }
}
Audit.defaultProps = defaultProps;
Audit.propTypes = propTypes;
