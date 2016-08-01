import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import axios from 'axios';

import Message from '../../components/common/Message/Message';

// 最大 20kb
const MAX_SIZE = 20 * 1024;

@connect()
export default class Uploader extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  state = {
    entering: false,
  }

  @autobind
  onDragEnter() {
    this.setState({ entering: true });
  }

  @autobind
  onDragLeave(e) {
    if (!this.judgeInside(e)) {
      this.setState({ entering: false });
    }
  }

  onDragOver(e) {
    e.preventDefault();
  }

  @autobind
  onDrop(e) {
    e.preventDefault();

    const { files } = e.nativeEvent.dataTransfer;
    this.sendFiles(files);
    this.setState({ entering: false });
  }

  @autobind
  onFileInputChange() {
    const { files } = this.refs.inputUpload;
    this.sendFiles(files);
  }

  sendFiles(files) {
    let hasInvalidFile = false;
    const fileList = [...files];

    if (files.length > 20) {
      Message.error('最多能上传 20 个文件！');
      return;
    }

    fileList.some(file => {
      if (file.type !== 'image/svg+xml') {
        Message.error('上传的文件必须是 SVG 文件！');
        hasInvalidFile = true;
        return true;
      }

      if (file.size > MAX_SIZE) {
        Message.error('上传的文件最大为 20KB！');
        hasInvalidFile = true;
        return true;
      }

      return false;
    });

    if (!hasInvalidFile) {
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('icon', file);
      });
      // 这里没有必要触发 reducer，直接使用请求跳转
      axios
        .post('/api/user/icons', formData)
        .then(() => {
          this.props.dispatch(push('/workbench'));
        })
        .catch(e => Message.error(e));
    }
  }

  judgeInside(e) {
    const uploadZone = this.refs.uploadZone;
    const style = window.getComputedStyle(uploadZone);
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { width, height } = style;
    if (uploadZone.contains(target) && target !== uploadZone) {
      // 在内部移动碰到文字时不算离开
      return true;
    }
    return offsetX > 0
      && offsetY > 0
      && offsetX < parseInt(width, 10)
      && offsetY < parseInt(height, 10);
  }

  render() {
    const { entering } = this.state;
    const classNames = classnames('upload-area', {
      'drag-on': entering,
    });

    return (
      <div
        ref="uploadZone"
        className={classNames}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        <div className="upload-instruct">
          <i className="iconfont upload-icon">&#xf50a;</i>
          <p>{entering ? '放开图标，马上上传' : '将SVG文件拖拽至此'}</p>
          <a className="upload-input-area">
            <input
              ref="inputUpload"
              type="file"
              onChange={this.onFileInputChange}
              className="click-upload" multiple="multiple"
            />
            OR 点此上传
          </a>
        </div>
      </div>
    );
  }
}
