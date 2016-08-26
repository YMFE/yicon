import './Workbench.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
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
@withRouter
export default class Workbench extends Component {
  static propTypes = {
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
    router: PropTypes.object,
    route: PropTypes.object,
  }

  componentWillMount() {
    this.props.fetchWorkbench().then(() => {
      const { icons } = this.props;
      if (icons.length) {
        this.props.selectEdit(0);
      } else {
        this.props.push('transition/upload-icon');
      }
    });
  }

  componentDidMount() {
    const { router, route } = this.props;
    router.setRouteLeaveHook(route, this.routerWillLeave);
    window.onbeforeunload = () => '';
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {};
  }

  @autobind
  routerWillLeave(nextLocation) {
    if (!nextLocation.pathname.includes('transition')) {
      /* eslint-disable no-alert */
      return confirm('还未提交，您修改的信息将不会被保存，是否离开本页面？');
    }
    return true;
  }

  @autobind
  select(index) {
    this.props.selectEdit(index);
  }

  @autobind
  delete(icons, index, id) {
    this.props.selectEdit(index);
    this.props.deleteIcon(id, icons);
    if (!icons.length) {
      this.props.push('transition/upload-icon');
    }
  }

  @autobind
  updateIcons(icons) {
    this.props.updateWorkbench(icons);
  }

  @autobind
  turnLeft(index) {
    this.props.selectEdit(index);
  }

  @autobind
  turnRight(index) {
    this.props.selectEdit(index);
  }

  calcDone() {
    const { icons } = this.props;
    const doneArr = icons.filter((icon) => (
      icon.name && icon.fontClass && icon.tags
    ));
    return doneArr;
  }

  @autobind
  selectRepo(id) {
    this.props.selectRepo(+id);
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
      this.props.selectEdit(0);
      this.props.updateWorkbench(noDone);
      if (!noDone.length) {
        this.props.push('transition/upload-icon');
      }
    });
  }

  @autobind
  showUploadDialog() {
    const doneNum = this.calcDone().length;
    const notDoneNum = this.props.icons.length - doneNum;
    const title = '提交上传';
    let content = `还有${notDoneNum}枚图标未设置完成，确认上传设置完成的${doneNum}枚图标吗？`;
    if (!notDoneNum) {
      content = '所有图标已设置完成，确认上传吗？';
    }
    dialog({
      title,
      content,
      onOk: this.uploadIcons,
    });
  }

  render() {
    const { index, icons, allRepoList, repoId } = this.props;
    const doneNum = this.calcDone().length;
    if (!icons.length || !icons[index]) {
      return null;
    }
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-upload-container'}>
          <IconsSetting
            title="上传图标设置"
            icons={icons}
            doneArr={this.calcDone()}
            index={index}
            onClick={this.select}
            onDelete={this.delete}
            saveName={this.updateIcons}
            selectStyle={this.updateIcons}
            saveTags={this.updateIcons}
            turnLeft={this.turnLeft}
            turnRight={this.turnRight}
          />
          <div className={'upload-submit'}>
            <div className={'clearfix'}>
              <p className={'upload-submit-tips'}>
                {
                  icons.length - doneNum ?
                  `你还有 ${icons.length - doneNum} 枚图标未设置未完成!` :
                  '全部设置完成!'
                }
              </p>
            </div>
            <div className={'upload-submit-setting'}>
              <span className={'submit-info'}>
                共上传 <span className={'icon-num'}>{doneNum}</span> 枚图标至
              </span>
              <div className={'select-repository'}>
                <Select
                  placeholder="选择图标库"
                  value={repoId}
                  onChange={this.selectRepo}
                >
                  {
                    allRepoList.map((repo) => (
                      <Option
                        value={`${repo.id}`}
                        key={repo.id}
                      >
                        {repo.name}
                      </Option>
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
