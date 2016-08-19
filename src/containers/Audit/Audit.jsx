import './Audit.scss';
import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
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
  push: PropTypes.func,
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
    push,
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
    this.props.fetchAuditIcons().then(() => {
      const { icons } = this.props;
      if (icons.length) {
        this.props.selectIcon(0);
      } else {
        this.props.push('transition/audit-icon');
      }
    });
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
    if (icons[index].passed === isPass) {
      icons[index].passed = '';
    } else {
      icons[index].passed = isPass;
    }
    this.props.updateAuditIcons(icons.concat());
    const newIndex = index < icons.length - 1 ? index + 1 : index;
    this.props.selectIcon(newIndex);
  }

  calcAuditDone() {
    const { icons } = this.props;
    const auditedIcons = [];
    const notAuditedIcons = [];
    icons.forEach((icon) => {
      if (typeof icon.passed === 'boolean') {
        const iconItem = {
          id: icon.id,
          fontClass: icon.fontClass,
          name: icon.name,
          tags: icon.tags,
          passed: icon.passed,
          repoId: icon.repo.id,
          uploader: icon.uploader,
        };
        auditedIcons.push(iconItem);
      } else {
        notAuditedIcons.push(icon);
      }
    });
    return { auditedIcons, notAuditedIcons };
  }

  @autobind
  auditIconsSubmit() {
    const { auditedIcons, notAuditedIcons } = this.calcAuditDone();
    this.props.auditIcons({ icons: auditedIcons }).then((res) => {
      if (res.payload.res) {
        this.props.selectIcon(0);
        this.props.updateAuditIcons(notAuditedIcons);
        if (!notAuditedIcons.length) {
          this.props.push('transition/audit-icon');
        }
      }
    });
  }

  @autobind
  showSubmitDialog() {
    const { auditedIcons } = this.calcAuditDone();
    const title = '提交审核';
    const content = `已审核完成${auditedIcons.length}枚图标，确认上传吗？`;
    dialog({
      title,
      content,
      onOk: this.auditIconsSubmit,
    });
  }

  render() {
    const { index, icons } = this.props;
    const icon = icons[index];
    if (!icons.length || !icon) {
      return null;
    }
    const auditedNum = this.calcAuditDone().auditedIcons.length;
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
            <div
              className={`aprv-btn pass ${icon.passed ? 'on' : ''}`}
              onClick={() => this.auditIcon(true)}
            ><i className="iconfont tag">&#xf078;</i>审核通过</div>
            <div
              className={`aprv-btn no-pass ${icon.passed === false ? 'on' : ''}`}
              onClick={() => this.auditIcon(false)}
            ><i className="iconfont tag">&#xf077;</i>审核不通过</div>
          </div>
          <div className="approval-submit">
            <button
              className={`submit ${auditedNum ? '' : 'disabled'}`}
              disabled={auditedNum === 0}
              onClick={this.showSubmitDialog}
            >提交已审核图标</button>
          </div>
        </div>
      </div>
    );
  }
}

Audit.defaultProps = defaultProps;
Audit.propTypes = propTypes;
