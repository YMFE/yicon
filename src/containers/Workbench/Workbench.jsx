import './Workbench.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';import {
  fetchWorkbench,
  uploadIcons,
  deleteIcon,
  updateWorkbench,
  selectEdit,
  selectRepo,
} from '../../actions/workbench.js';
import { push } from 'react-router-redux';
import dialog from '../../components/common/Dialog/Confirm.jsx';
import Select from '../../components/common/Select/';
import IconsSetting from '../../components/common/IconsSetting/IconsSetting.jsx';
const Option = Select.Option;
import { autobind } from 'core-decorators';

const defaultProps = {};
const propTypes = {
  index: PropTypes.number,
  repoId: PropTypes.number,
  icons: PropTypes.array,
  allRepoList: PropTypes.array,
  fetchWorkbench: PropTypes.func,
  uploadIcons: PropTypes.func,
  updateWorkbench: PropTypes.func,
  deleteIcon: PropTypes.func,
  selectEdit: PropTypes.func,
  selectRepo: PropTypes.func,
  push: PropTypes.func,
};
@connect(
  state => ({
    icons: state.workbench.icons,
    index: state.workbench.selcIndex,
    repoId: state.workbench.repoId,
    allRepoList: state.repository.allReposotoryList,
  }),
  {
    fetchWorkbench,
    uploadIcons,
    updateWorkbench,
    deleteIcon,
    selectEdit,
    selectRepo,
    push,
  }
)
export default class Workbench extends Component {
  componentWillMount() {
    this.props.fetchWorkbench().then(() => {
      const { icons } = this.props;
      if (icons.length) {
        this.props.selectEdit(0);
      } else {
        this.props.push('/upload');
      }
    });
  }

  @autobind
  select(index) {
    this.props.selectEdit(index);
  }

  @autobind
  delete(icons, index, id) {
    // const { icons } = this.props;
    // const selcIndex = this.props.index;
    // const id = icons[index].id;
    // icons.splice(index, 1);
    // this.props.deleteIcon(id, icons);
    // if (selcIndex >= index) {
    //   const newIndex = selcIndex - 1 < 0 ? 0 : selcIndex - 1;
    //   this.props.selectEdit(newIndex);
    // }
    this.props.deleteIcon(id, icons);
    this.props.selectEdit(index);
    if (!icons.length) {
      this.props.push('/upload');
    }
  }

  @autobind
  updateIcons(icons) {
    // const { index, icons } = this.props;
    // icons[index].name = val;
    this.props.updateWorkbench(icons);
  }

  calcDone() {
    const { icons } = this.props;
    const doneArr = icons.filter((icon) => (
      icon.name && icon.fontClass
    ));
    return doneArr;
  }

  @autobind
  selectRepo(id) {
    this.props.selectRepo(id);
  }

  @autobind
  uploadIcons() {
    const icons = this.calcDone();
    this.props.uploadIcons({
      repoId: this.props.repoId,
      icons,
    }).then(() => {
      const noDone = this.props.icons.filter((icon) => (
        !(icon.name && icon.fontClass)
      ));
      if (!noDone.length) {
        this.props.push('/upload');
      } else {
        this.props.updateWorkbench(noDone);
      }
    });
  }

  @autobind
  showUploadDialog() {
    const doneNum = this.calcDone().length;
    const title = '提交上传';
    const content = `还有${this.props.icons.length - doneNum}枚图标未设置完成，确认上传设置完成的${doneNum}枚图标吗？`;
    dialog({
      title,
      content,
      onOk: this.uploadIcons,
    });
  }

  render() {
    const { index, icons, allRepoList, repoId } = this.props;
    const doneNum = this.calcDone().length;
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
          <div className={'upload-submit'}>
            <div className={'clearfix'}>
              <p className={'upload-submit-tips'}>你还有{icons.length - doneNum}枚图标未设置未完成!</p>
            </div>
            <div className={'upload-submit-setting'}>
              <span className={'submit-info'}>
                共上传<span className={'icon-num'}>{doneNum}</span>枚图标至
              </span>
              <div className={'select-repository'}>
                <Select
                  placeholder="选择图标库"
                  value={repoId}
                  onChange={this.selectRepo}
                >
                  {
                    allRepoList.map((repo) => (
                      <Option value={repo.id} key={repo.id}>{repo.name}</Option>
                    ))
                  }
                </Select>
              </div>
              <button
                className={`submit-btn ${doneNum && repoId ? '' : 'disabled'}`}
                onClick={this.showUploadDialog}
                disabled={!(doneNum && repoId)}
              >确认并完成上传</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Workbench.defaultProps = defaultProps;
Workbench.propTypes = propTypes;
