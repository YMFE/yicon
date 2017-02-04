import './Download.scss';
import React, { PropTypes } from 'react';
import Dialog from '../../components/common/Dialog/Index';
import Icon from '../../components/common/Icon/Icon';

const Download = (props) => {
  const { deleted, added, replaced } = props.comparison;
  return (<Dialog
    confrimText={props.confrimText}
    comparison={props.comparison}
    onOk={props.onOk}
    onCancel={() => { props.onCancel(); }}
    title="生成版本并下载字体"
    visible={props.showDownloadDialog}
  >
    <form className="project-form Download">
      <div style={{ display: `${deleted.length ? 'block' : 'none'}` }}>
        <div className="icon-title">
          <i className="iconfont">&#xf513;</i>
          <span> 删除了
            <em className="count">{deleted.length}</em>
          个图标</span>
        </div>
        <div className="clearfix yicon-myiconvs-info">
          {
            deleted.map((icon, index) => (
              <div className="icon-item" key={index}>
                <Icon
                  d={icon.path}
                />
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ display: `${added.length ? 'block' : 'none'}` }}>
        <div className="icon-title">
          <i className="iconfont">&#xf470;</i>
          <span> 增加了
            <em className="count">{added.length}</em>
          个图标</span>
        </div>
        <div className="clearfix yicon-myiconvs-info">
          {
            added.map((icon, index) => (
              <div className="icon-item" key={index}>
                <Icon
                  d={icon.path}
                />
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ display: `${replaced.length ? 'block' : 'none'}` }}>
        <div className="icon-title">
          <i className="iconfont">&#xf515;</i>
          <span> 替换了
            <em className="count">{replaced.length}</em>
          个图标</span>
        </div>
        <div className="clearfix yicon-myiconvs-info">
          {
            replaced.map((icon, index) => (
              <div className="options" key={index}>
                <div className="icon-item">
                  <Icon
                    d={icon.old.path}
                  />
                </div>
                <div className="operate-icon">
                  <i className="iconfont">&#xf0f8;</i>
                </div>
                <div className="icon-item">
                  <Icon
                    d={icon.new.path}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="icon-title">
        <i className="iconfont">&#xf516;</i>
        <span> 选择升级版本类型：</span>
      </div>
      <ul
        style={{
          padding: '10px 0',
        }}
      >
        <li>
          <label
            htmlFor="project-version-revision"
            onClick={props.onChange}
          >
            小版本迭代
            <input
              type="radio"
              value="revision"
              name="project-version-revision"
              checked={props.value === 'revision'}
              onChange={() => {}}
            />
          </label>
        </li>
        <li>
          <label
            htmlFor="project-version-minor"
            onClick={props.onChange}
          >
            较少变化
            <input
              type="radio"
              value="minor"
              name="project-version-minor"
              checked={props.value === 'minor'}
              onChange={() => {}}
            />
          </label>
        </li>
        <li>
          <label
            htmlFor="project-version-major"
            onClick={props.onChange}
          >
            重大变更
            <input
              type="radio"
              value="major"
              name="project-version-major"
              checked={props.value === 'major'}
              onChange={() => {}}
            />
          </label>
        </li>
      </ul>
      <ul>
        <li>当前最高版本为：{props.currenthighestVersion}</li>
        <li>生成的新版本为：<i style={{ fontWeight: 600 }}>{props.nextVersion}</i></li>
      </ul>
    </form>
  </Dialog>);
};

Download.propTypes = {
  onChange: PropTypes.func,
  confrimText: PropTypes.string,
  showDownloadDialog: PropTypes.bool,
  currenthighestVersion: PropTypes.string,
  nextVersion: PropTypes.string,
  comparison: PropTypes.object,
  value: PropTypes.oneOf([
    'revision',
    'minor',
    'major',
  ]),
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};
export default Download;
