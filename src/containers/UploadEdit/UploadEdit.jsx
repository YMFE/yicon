import React, { Component } from 'react';
import './UploadEdit.scss';
export default class UploadEdit extends Component {
  render() {
    return (
      <div className={'yicon-main yicon-upload'}>
        <div className={'yicon-upload-container'}>
          <h2 className={'upload-title'}>上传图标设置</h2>
          <div className={'upload-icon clearfix'}>
            <button className={'icons-more-btn icons-more-btn-left'}>
              <i className={'iconfont icons-more-btn-icon'}>&#xf50f;</i></button>
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
                <i className={'iconfont upload-btn-icon'}>&#xf50f;</i>
                <p className={'upload-btn-txt'}>上传图标</p>
              </li>
            </ul>
            <button className={'icons-more-btn icons-more-btn-right'}>
              <i className={'iconfont icons-more-btn-icon'}>&#xf50f;</i></button>
          </div>
          <div className={'upload-setting clearfix'}>
            <button className={'set-pre-next-btn'}>
              <i className={'iconfont set-pre-next-icon'}>&#xf50f;</i></button>
            <div className={'icon-big-img'}>
              <div className={'bg-grid'}>

                <div className={'hline'} style={{ top: '0px' }}></div>
                <div className={'hline'} style={{ top: '19px' }}></div>
                <div className={'hline'} style={{ top: '38px' }}></div>
                <div className={'hline'} style={{ top: '57px' }}></div>
                <div className={'hline'} style={{ top: '76px' }}></div>
                <div className={'hline'} style={{ top: '95px' }}></div>
                <div className={'hline'} style={{ top: '114px' }}></div>
                <div className={'hline'} style={{ top: '133px' }}></div>
                <div className={'hline'} style={{ top: '152px', background: '#ff8c8c' }}></div>
                <div className={'hline'} style={{ top: '171px' }}></div>
                <div className={'hline'} style={{ top: '190px' }}></div>
                <div className={'hline'} style={{ top: '209px' }}></div>
                <div className={'hline'} style={{ top: '228px' }}></div>
                <div className={'hline'} style={{ top: '247px' }}></div>
                <div className={'hline'} style={{ top: '266px' }}></div>
                <div className={'hline'} style={{ top: '285px' }}></div>
                <div className={'hline'} style={{ top: '304px' }}></div>

                <div className={'vline'} style={{ left: '0px' }}></div>
                <div className={'vline'} style={{ left: '19px' }}></div>
                <div className={'vline'} style={{ left: '38px' }}></div>
                <div className={'vline'} style={{ left: '57px' }}></div>
                <div className={'vline'} style={{ left: '76px' }}></div>
                <div className={'vline'} style={{ left: '95px' }}></div>
                <div className={'vline'} style={{ left: '114px' }}></div>
                <div className={'vline'} style={{ left: '133px' }}></div>
                <div className={'vline'} style={{ left: '152px', background: '#ff8c8c;' }}></div>
                <div className={'vline'} style={{ left: '171px' }}></div>
                <div className={'vline'} style={{ left: '190px' }}></div>
                <div className={'vline'} style={{ left: '209px' }}></div>
                <div className={'vline'} style={{ left: '228px' }}></div>
                <div className={'vline'} style={{ left: '247px' }}></div>
                <div className={'vline'} style={{ left: '266px' }}></div>
                <div className={'vline'} style={{ left: '285px' }}></div>
                <div className={'vline'} style={{ left: '304px' }}></div>
              </div>
              <div className={'big-icon'}>
                <i className={'iconfont big'}>&#xf50f;</i>
              </div>
            </div>
            <div className={'setting-opts'}>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-name'} className={'set-opt-name'}>图标名称<span
                  className={'require'}
                >*</span></label>
                <div className={'set-input-wrap'}><input
                  className={'set-input'}
                  type={'text'}
                  id={'set-icon-name'}
                  placeholder={'请输入图标名称'}
                /></div>
              </div>
              <div className={'setting-opt'}>
                <label htmlFor={'set-icon-style'} className={'set-opt-name'}>图标风格<span
                  className={'require'}
                >*</span></label>
                <div className={'set-input-wrap'}><input
                  className={'set-input'}
                  type={'text'}
                  id={'set-icon-style'} placeholder={'请输选择'}
                /><i className={'iconfont set-style-icon'}>&#xf032;</i>
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
            >&#xf50f;</i></button>
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
