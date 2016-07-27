import React, { Component, PropTypes } from 'react';
import './Upload.scss';
const defaultProps = {
  defaultClass: 'upload-area',
  dragOnClass: 'drag-on',
};
const propTypes = {
  defaultClass: PropTypes.string,
  dragOnClass: PropTypes.string,
};
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadAreaClass: this.props.defaultClass,
    };
  }
  handlerDragenter = (event) => {
    this.setState({ uploadAreaClass: 'upload-area drag-on' });
    console.log(event);
    // const uploadZone = document.querySelector('.upload-area');
    // uploadZone.className = 'upload-area drag-on';
  }
  resetStyle = (event) => {
    const uploadZone = document.querySelector('.upload-area');
    if (!this.judgeInside(event, uploadZone)) {
      this.toggleClass(event.target, 'drag-on');
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
    let fileList = [];
    event.preventDefault();
    fileList = event.dataTransfer.files;
    if (fileList.length === 0) {
      return false;
    }
    console.log(fileList);
    return false;
  }
  handlerFileChange = (event) => {
    alert(event);
    console.log(event.files);
    // _sendFiles(event );
  }
  judgeInside = (event, ele) => {
    const style = window.getComputedStyle(ele);
    const current = event.target;
    const uploadZone = document.querySelector('.yicon-upload-icon .upload-area');
    if (uploadZone.contains(current) && current !== uploadZone) { // fix 内部的移动时文字改变
      return true;
    }
    return event.offsetX > 0 &&
    event.offsetX < parseInt(style.width, 10) &&
    event.offsetY > 0 &&
    event.offsetY < parseInt(style.height, 10);
  }
  toggleClass = (ele, className) => {
    let eleClass = ele.className;
    const index = eleClass.indexOf(className);
    let arr = [];
    if (index === -1) {
      // classname  存入state中
      eleClass = '`{$(eleClass) $(className)}`';
      // top: '152px', background: '#ff8c8c'
    } else {
      arr = ele.className.split('');
      arr.splice(index, className.length + 2);
      eleClass = arr.join('');
    }
  }
  render() {
    let { uploadAreaClass } = this.state;
    console.log(uploadAreaClass);
    return (
      <div className={'yicon-upload-icon'}>
        <div
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
