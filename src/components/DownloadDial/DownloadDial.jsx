import './DownloadDial.scss';
import React, { Component, PropTypes } from 'react';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';

class DownloadDial extends Component {

  render() {
    const { icon } = this.props;
    return (
      <div className="tan-container">
        <IconBgGrid size={257} icon={icon} />
        <div className="tan-detail">
          <div className="tan-detail-header">
            <div className="icon-name">
              <span className="icon-name-txt">{icon.name}</span>
              <button className="to-edit-name">修改名称</button>
            </div>
            <div className="edit-name">
              <input type="text" className="input-name" />
              <button className="save">保存</button>
              <button className="cancel">取消</button>
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：sem.mao</span>&nbsp;&nbsp;
            <span className="version">版本：1.0.2</span>
          </div>
          <div className="set-tag">
            <div className="set-input-wrap">
              <input
                className="set-input"
                type="text"
                id="set-icon-tag"
                placeholder="添加图标标签，回车提交，可多次提交"
              />
              <i className="iconfont set-tag-icon">&#xf50f;</i>
            </div>
            <ul className="icon-tag-list">
              <li className="icon-tag">
                <span>会议室_填色</span><i className="iconfont delete">&#xf077;</i>
              </li>
              <li className="icon-tag">
                <span>会场</span><i className="iconfont delete">&#xf077;</i>
              </li>
              <li className="icon-tag">
                <span>会议室_填色</span><i className="iconfont delete">&#xf077;</i>
              </li>
            </ul>
          </div>
          <div className="select-color clearfix">
            <ul className="color-list">
              <li className="color-item" style={{ background: '#1dba9c' }}></li>
              <li className="color-item" style={{ background: '#26cb72' }}></li>
              <li className="color-item" style={{ background: '#5aace2' }}></li>
              <li className="color-item" style={{ background: '#9c58b6' }}></li>
              <li className="color-item" style={{ background: '#34475e' }}></li>
              <li className="color-item" style={{ background: '#f3c52d' }}></li>
              <li className="color-item" style={{ background: '#e88027' }}></li>
              <li className="color-item" style={{ background: '#ff5555' }}></li>
              <li className="color-item" style={{ background: '#ecf0f1' }}></li>
              <li className="color-item" style={{ background: '#a9b7b7' }}></li>
            </ul>
            <div className="color-select-box">
              <span>#ff5555</span>
              <div className="color-show"></div>
            </div>
            <div className="set-size">
              <span>64</span><i className="iconfont drop-down">&#xf032;</i>
            </div>
          </div>
          <div className="download-box">
            <button className="download-btn">SVG下载</button>
            <button className="download-btn">AI下载</button>
            <button className="download-btn">PNG下载</button>
          </div>
        </div>
      </div>
    );
  }
}

DownloadDial.propTypes = {
  icon: PropTypes.object,
};

export default DownloadDial;
