import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import './Upload.scss';
const defaultProps = {
  uploadAreaClass: 'upload-area',
  isEntering: false,
};
const propTypes = {
  uploadAreaClass: PropTypes.string,
  isEntering: PropTypes.bool,
};
const MAX_SIZE = 500; // 文件大小限制
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadAreaClass: this.props.uploadAreaClass,
      isEntering: this.props.isEntering,
    };
  }
  handlerDragenter = () => {
    this.setState({ uploadAreaClass: 'upload-area drag-on', isEntering: true });
  }
  resetStyle = (event) => {
    const uploadZone = this.refs.uploadArea;
    if (!this.judgeInside(event, uploadZone)) {
      this.toggleClass(event.target, 'drag-on');
      this.setState({ isEntering: false });
    }
    // if(!util.judgeInside(event, uploadZone)) {
    //    util.toggleClass(event.target, 'dragging');
    //   	_uploadShow.isEntering = false;
    // }
  }
  handlerDragover = (event) => {
    event.preventDefault();
  }
  handlerDrop = (event) => {
    console.log('handlerDrop');
    let fileList = [];
    event.preventDefault();// 取消浏览器的默认拖拽效果
    fileList = event.dataTransfer.files;
    if (fileList.length === 0) {
      return false;
    }
    this._sendFiles(fileList);
    return false;
    // window.location.href = '/UploadEdit';
    // return false;
  }
  handlerFileChange = () => {
    console.log('handlerFileChange');
    this._sendFiles(this.refs.inputUpload);
  }
  judgeInside = (event, ele) => {
    const style = window.getComputedStyle(ele);
    const current = event.target;
  //  const uploadZone = document.querySelector('.yicon-upload-icon .upload-area');
    const uploadZone = this.refs.uploadArea;
    if (uploadZone.contains(current) && current !== uploadZone) { // fix 内部的移动时文字改变
      return true;
    }
    return event.offsetX > 0 &&
    event.offsetX < parseInt(style.width, 10) &&
    event.offsetY > 0 &&
    event.offsetY < parseInt(style.height, 10);
  }
  toggleClass = (ele, className) => {
    const eleClass = ele.className;
    const index = eleClass.indexOf(className);
    if (index === -1) {
      this.setState({ uploadAreaClass: `upload-area ${className}` });
    } else {
      this.setState({ uploadAreaClass: 'upload-area' });
    }
  }
  _sendFiles = (files) => {
    let fileSize = 0;
    const fd = new FormData();
    const repoId = 1111; // globalContext.respository.id
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.indexOf('svg') === -1) {
        alert('请选择svg文件');
        return false;
      }
      fileSize = files[i].size;
    }
    if (Math.floor(fileSize / 1024) > MAX_SIZE) {
      alert('上传文件大小不能超过500k');
      return false;
    }
    for (let i = 0; i < files.length; i++) {
      fd.append(`iconfont${i}`, files[i]);
    }
    fd.append('repoId', repoId);
    // 这里开始调上传接口
    location.assign('/UploadEdit/');
    return false;
    // xhr = new XMLHttpRequest();
    // xhr.open("post", "");
  }
  render() {
    let { uploadAreaClass } = this.state;
    return (
      <div className={'yicon-upload-icon'}>
        <div
          ref={'uploadArea'}
          className={uploadAreaClass}
          onDragEnter={evt => this.handlerDragenter(evt)}
          onDragLeave={evt => this.resetStyle(evt)}
          onDragOver={evt => this.handlerDragover(evt)}
          onDrop={evt => this.handlerDrop(evt)}
        >
          <div className={'upload-instruct'}>
            <i className={'iconfont upload-icon'}>&#xf50a;</i>
            <p>将SVG文件拖拽至此</p>
            <a className={'upload-input-area'}><input
              ref={'inputUpload'}
              type={'file'}
              className={'click-upload'} multiple={'multiple'}
              onChange={(evt) => this.handlerFileChange(evt)}
            />OR 点此上传</a>
          </div>
        </div>
        <div className={'upload-notes'}>
          <div className={'note-bar'}>
            <h3 className={'note-title'}>图标制作注意事项</h3>
            <button className={'download'}>下载AI模板</button>
            <div className={'to-detail'}>
              <a className={'to-detail-link'} href={'#'}>查看详细说明<i
                className={'iconfont to-detail-arr'}
              >&#xf50f;</i>
              </a>
            </div>
          </div>
          <ul className={'note-list'}>
            <li className={'note-item'}>
              <div className={'note-img-box'}>
                <img src={''} alt={''} />
              </div>
              <h4 className={'note-item-title'}>路径闭合</h4>
              <p className={'note-item-txt'}>图形要封闭，不能有出现未闭合的路径</p>
            </li>
            <li className={'note-item'}>
              <div className={'note-img-box'}>
                <img src={''} alt={''} />
              </div>
              <h4 className={'note-item-title'}>形状合并</h4>
              <p className={'note-item-txt'}>如果有两个以上的图形，或者有布尔关系的图形请对图形合并并且扩展</p>
            </li>
            <li className={'note-item'}>
              <div className={'note-img-box'}>
                <img src={''} alt={''} />
              </div>
              <h4 className={'note-item-title'}>控制节点数量</h4>
              <p className={'note-item-txt'}>图形尽量减少节点使用，简化图形，去除无用节点</p>
            </li>
            <li className={'note-item'}>
              <div className={'note-img-box'}>
                <img src={''} alt={''} />
              </div>
              <h4 className={'note-item-title'}>图标尺寸</h4>
              <p className={'note-item-txt'}>请务必在限定边框内绘制完成图形，尽量撑满绘制区域，以16X16点阵为对齐参考。</p>
            </li>
          </ul>
        </div>
      </div>

    );
  }
}

Upload.defaultProps = defaultProps;
Upload.propTypes = propTypes;
