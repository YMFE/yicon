import './Audit.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';import {
  fetchAuditIcons,
  updateAuditIcons,
  AuditIcons,
  selectIcon,
} from '../../actions/audit.js';
import IconsSetting from '../../components/common/IconsSetting/IconsSetting.jsx';
import { autobind } from 'core-decorators';

@connect(
  state => ({
    icons: state.audit.icons,
    index: state.audit.selcIndex,
  }),
  {
    fetchAuditIcons,
    updateAuditIcons,
    AuditIcons,
    selectIcon,
  }
)
export default class Audit extends Component {
  static propTypes = {
    index: PropTypes.number,
    icons: PropTypes.array,
    fetchAuditIcons: PropTypes.func,
    updateAuditIcons: PropTypes.func,
    AuditIcons: PropTypes.func,
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
    this.props.updateAuditIcons(icons);
    this.props.selectIcon(index);
  }

  @autobind
  updateIcons(icons) {
    this.props.updateAuditIcons(icons);
  }

  @autobind
  AuditIcons() {
    // const icons = this.calcDone();
    // this.props.uploadIcons({
    //   repoId: this.props.repoId,
    //   icons,
    // }).then(() => {
    //   const noDone = this.props.icons.filter((icon) => (
    //     !(icon.name && icon.fontClass)
    //   ));
    //   if (!noDone.length) {
    //     this.props.push('/upload');
    //   } else {
    //     this.props.updateAudit(noDone);
    //   }
    // });
  }

  @autobind
  showUploadDialog() {
    // const doneNum = this.calcDone().length;
    // const title = '提交上传';
    // const content = `还有${this.props.icons.length - doneNum}枚图标未设置完成，确认上传设置完成的${doneNum}枚图标吗？`;
    // dialog({
    //   title,
    //   content,
    //   onOk: this.uploadIcons,
    // });
  }

  render() {
    const { index, icons } = this.props;
    if (!icons.length) {
      return null;
    }
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-upload-container'}>
          <IconsSetting
            title="上传图标设置"
            icons={icons}
            index={index}
            onClick={this.select}
            onDelete={this.delete}
            saveName={this.updateIcons}
            selectStyle={this.updateIcons}
            saveTags={this.updateIcons}
          />
        </div>
      </div>
    );
  }
}
