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
import IconBgGrid from '../../components/common/IconBgGrid/IconBgGrid';
import Select from '../../components/common/Select/';
import SetTag from '../../components/EditIcon/SetTag/SetTag.jsx';
import Slick from '../../components/common/Slick/index.jsx';
import Input from '../../components/common/Input/Index.jsx';
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
  setTags(tags) {
    const { index, icons } = this.props;
    icons[index].tags = tags;
    this.props.updateWorkbench(icons.concat());
  }

  @autobind
  select(index) {
    this.props.selectEdit(index);
  }

  @autobind
  delete(index) {
    const { icons } = this.props;
    const selcIndex = this.props.index;
    const id = icons[index].id;
    icons.splice(index, 1);
    this.props.deleteIcon(id, icons.concat());
    if (selcIndex >= index) {
      this.props.selectEdit(selcIndex - 1);
    }
    if (!icons.length) {
      this.props.push('/upload');
    }
  }

  @autobind
  blur(val) {
    const { index, icons } = this.props;
    icons[index].name = val;
    this.props.updateWorkbench(icons.concat());
  }

  calcDone() {
    const { icons } = this.props;
    const doneArr = icons.filter((icon) => (
      icon.name && icon.fontClass
    ));
    return doneArr.length;
  }
  @autobind
  selectStyle(style) {
    const { index, icons } = this.props;
    icons[index].fontClass = style;
    this.props.updateWorkbench(icons.concat());
  }
  @autobind
  selectRepo(id) {
    this.props.selectRepo(id);
  }

  render() {
    const { index, icons, allRepoList, repoId } = this.props;
    const iconDetail = icons[index];
    const doneNum = this.calcDone();
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-upload-container'}>
          <h2 className={'upload-title'}>上传图标设置</h2>
          <Slick
            itemData={icons}
            defaultCurrent={index}
            onClick={this.select}
            onDelete={this.delete}
            curr
          />
          <div className={'upload-setting clearfix'}>
            <button className={'set-pre-next-btn'}>
              <i className={'iconfont set-pre-next-icon'}>&#xf1c3;</i>
            </button>
            <IconBgGrid
              iconPath={iconDetail.path || ''}
            />
            <div className={'setting-opts'}>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-name'} className={'set-opt-name'}>图标名称<span
                  className={'require'}
                >*</span></label>
                <Input
                  defaultValue={iconDetail.name}
                  placeholder="请输入图标名称"
                  extraClass="edit-name"
                  keyDown={this.save}
                  blur={this.blur}
                  regExp="\S+"
                  errMsg="名字不能为空"
                  ref="myInput"
                />
              </div>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-style'} className={'set-opt-name'}>图标风格<span
                  className={'require'}
                >*</span></label>
                <div className={'set-input-wrap setting-opt-select'}>
                  <Select
                    placeholder="请输选择"
                    value={iconDetail.fontClass}
                    className={'info_error'}
                    onChange={this.selectStyle}
                  >
                    <Option value="-f">线性图标</Option>
                    <Option value="-o">填色图标</Option>
                  </Select>
                  <div className={`error-info ${iconDetail.fontClass ? 'hide' : ''}`}>
                    请选择图标风格
                  </div>
                </div>
              </div>

              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-tag'} className={'set-opt-name'}>图标标签&nbsp;&nbsp;</label>
                <SetTag
                  onTagChange={this.update}
                  tags={iconDetail.tags || ''}
                />
              </div>

            </div>
            <button className={'set-pre-next-btn set-pre-next-right'}><i
              className={'iconfont set-pre-next-icon'}
            >&#xf1c1;</i></button>
          </div>
          <div className={'upload-submit'}>
            <div className={'clearfix'}>
              <p className={'upload-submit-tips'}>你还有{icons.length - doneNum}枚图标未设置未完成!</p>
            </div>
            <div className={'upload-submit-setting'}>
              <span className={'submit-info'}>
                共上传<span className={'icon-num'}>{doneNum}</span>枚图标至
              </span>
              <div className={'select-repository'}>
                {
                // <input className={'select-input'} type={'text'} placeholder={'选择图标库'} />
                // <i className={'iconfont select-repository-icon'}>&#xf032;</i>
                }
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
              <button className={'submit-btn'}>确认并完成上传</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Workbench.defaultProps = defaultProps;
Workbench.propTypes = propTypes;
