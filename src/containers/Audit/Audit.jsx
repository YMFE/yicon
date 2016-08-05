import './Audit.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';import {
  fetchAuditIcons,
  updateAuditIcons,
  auditIcons,
  selectIcon,
} from '../../actions/audit.js';
import IconsSetting from '../../components/common/IconsSetting/IconsSetting.jsx';
import dialog from '../../components/common/Dialog/Confirm.jsx';
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
  static propTypes = {
    index: PropTypes.number,
    icons: PropTypes.array,
    fetchAuditIcons: PropTypes.func,
    updateAuditIcons: PropTypes.func,
    auditIcons: PropTypes.func,
    selectIcon: PropTypes.func,
  }

  defaultProps = {}

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

  calcAuditDone() {
    const { icons } = this.props;
    const submitIcons = [];
    const notSubmitIcons = [];
    icons.forEach((icon) => {
      if (icon.hasOwnProperty('passed')) {
        const iconItem = {
          id: icon.id,
          fontClass: icon.fontClass,
          name: icon.name,
          tags: icon.tags,
          passed: icon.passed,
          repoId: icon.repo.id,
          uploader: icon.uploader,
        };
        submitIcons.push(iconItem);
      } else {
        notSubmitIcons.push(icon);
      }
    });
    return { submitIcons, notSubmitIcons };
  }

  @autobind
  auditIconsSubmit() {
    const { submitIcons, notSubmitIcons } = this.calcAuditDone();
    this.props.auditIcons({ icons: submitIcons }).then((res) => {
      if (res.payload.res) {
        this.props.selectIcon(0);
        this.props.updateAuditIcons(notSubmitIcons);
      }
    });
  }

  @autobind
  showSubmitDialog() {
    const { submitIcons } = this.calcAuditDone();
    const title = '提交审核';
    const content = `已审核完成${submitIcons.length}枚图标，确认上传吗？`;
    dialog({
      title,
      content,
      onOk: this.auditIconsSubmit,
    });
  }

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
            <button className="submit" onClick={this.showSubmitDialog}>提交已通过审核图标生成字体</button>
          </div>
        </div>
      </div>
    );
  }
}

Audit.defaultProps = defaultProps;
Audit.propTypes = propTypes;
