import React, { Component, PropTypes } from 'react';
import './UploadEdit.scss';
import IconBgGrid from '../../components/common/IconBgGrid/IconBgGrid';
import Select from '../../components/common/Select/';
const Option = Select.Option;
// const iconType = {
//   0: {
//     value: '',
//     label: '请选择',
//   },
//   1: {
//     value: '-f',
//     label: '线形图标',
//   },
//   2: {
//     value: '-o',
//     label: '填色图标',
//   },
// };

const propTypes = {
  icon: PropTypes.object,
};
export default class UploadEdit extends Component {
  render() {
    // const { icon } = this.props;
    const icon = '&#xf50f;';
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-upload-container'}>
          <h2 className={'upload-title'}>上传图标设置</h2>
          <div className={'upload-icon clearfix'}>
            <button className={'icons-more-btn icons-more-btn-left'}>
              <i className={'iconfont icons-more-btn-icon'}>&#xf1c3;</i></button>
            <ul className={'upload-icon-list'}>
              <li className={'upload-icon-item'}>
                <i className={'iconfont delete'}>&#xf077;</i>
                <i className={'iconfont upload-icon'}>&#xf50f;</i>
              </li>
              <li className={'upload-icon-item'}>
                <i className={'iconfont delete'}>&#xf077;</i>
                <i className={'iconfont upload-icon'}>&#xf50f;</i>
              </li>
              <li className={'upload-icon-item on'}>
                <i className={'iconfont delete'}>&#xf077;</i>
                <i className={'iconfont upload-icon'}>&#xf50f;</i>
              </li>
              <li className={'upload-icon-btn'}>
                <i className={'iconfont upload-btn-icon'}>&#xf3e1;</i>
                <p className={'upload-btn-txt'}>上传图标</p>
              </li>
            </ul>
            <button className={'icons-more-btn icons-more-btn-right'}>
              <i className={'iconfont icons-more-btn-icon'}>&#xf1c1;</i></button>
          </div>
          <div className={'upload-setting clearfix'}>
            <button className={'set-pre-next-btn'}>
              <i className={'iconfont set-pre-next-icon'}>&#xf1c3;</i></button>
            <IconBgGrid size={350} icon={icon} />
            <div className={'setting-opts'}>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-name'} className={'set-opt-name'}>图标名称<span
                  className={'require'}
                >*</span></label>
                <div className={'set-input-wrap info-error'}><input
                  className={'set-input'}
                  type={'text'}
                  id={'set-icon-name'}
                  placeholder={'请输入图标名称'}
                />
                  <div className={'error-info'}>请输入图标名称</div>
                </div>

              </div>
              {/*
                <label htmlFor={'set-icon-style'} className={'set-opt-name'}>图标风格<span
                className={'require'}
              >*</span></label>
              <div className={'set-input-wrap'}><input
                className={'set-input'}
                type={'text'}
                id={'set-icon-style'} placeholder={'请输选择'}
              /><i className={'iconfont set-style-icon'}>&#xf032;</i>
              </div>
                */}
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-style'} className={'set-opt-name'}>图标风格<span
                  className={'require'}
                >*</span></label>
                <div className={'set-input-wrap setting-opt-select'}>
                  <Select placeholder="请输选择" className={'info_error'}>
                    <Option value="线性图标">线性图标</Option>
                    <Option value="填色图标">填色图标</Option>
                  </Select>
                  <div className={'error-info'}>请选择图标风格</div>
                </div>
              </div>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-tag'} className={'set-opt-name'}>图标标签&nbsp;&nbsp;</label>
                <div className={'set-input-wrap'}><input
                  className={'set-input'}
                  type={'text'} id={'set-icon-tag'} placeholder={'回车提交，可多次提交'}
                /><i className={'iconfont set-tag-icon'}>&#xf50f;</i></div>
                <ul className={'icon-tag-list'}>
                  <li className={'icon-tag'}>
                    <span>会议室_填色</span><i className={'iconfont delete'}>&#xf077;</i>
                  </li>
                  <li className={'icon-tag'}>
                    <span>会场</span><i className={'iconfont delete'}>&#xf077;</i>
                  </li>
                  <li className={'icon-tag'}>
                    <span>会议室_填色</span><i className={'iconfont delete'}>&#xf077;</i>
                  </li>
                </ul>
              </div>
            </div>
            <button className={'set-pre-next-btn set-pre-next-right'}><i
              className={'iconfont set-pre-next-icon'}
            >&#xf1c1;</i></button>
          </div>
          <div className={'upload-submit'}>
            <div className={'clearfix'}>
              <p className={'upload-submit-tips'}>你还有三枚图标未设置未完成!</p>
            </div>
            <div className={'upload-submit-setting'}>
              <span className={'submit-info'}>共上传<span className={'icon-num'}>11</span>枚图标至</span>
              <div className={'select-repository'}>
                <input className={'select-input'} type={'text'} placeholder={'选择图标库'} />
                <i className={'iconfont select-repository-icon'}>&#xf032;</i>
              </div>
              <button className={'submit-btn'}>确认并完成上传</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UploadEdit.propTypes = propTypes;
