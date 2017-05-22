import './DownloadDialog.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editIconStyle } from '../../actions/icon';
import IconBgGrid from '../common/IconBgGrid/IconBgGrid.jsx';
import { COLOR } from '../../constants/validate';
import Input from '../common/Input/Index.jsx';
import Select from '../common/Select';
const Option = Select.Option;
import { autobind } from 'core-decorators';
import axios from 'axios';

@connect(
  state => ({
    iconDetail: state.icon,
  }),
  {
    editIconStyle,
  }
)
class DownloadDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  @autobind
  changeIconColor(color, isError) {
    if (!isError) {
      this.props.editIconStyle({ color });
    }
  }

  @autobind
  changeIconSize(size) {
    this.props.editIconStyle({ size: +size });
  }

  tagsToArr(tags) {
    return tags.split(/[,| ]+/);
  }

  @autobind
  download(type) {
    const { id, iconStyle: { color, size } } = this.props.iconDetail;
    axios
      .post(`/api/download/icon/${type}`, { iconId: id, color, size })
      .then(ret => {
        const { res, data } = ret.data;
        if (res) {
          window.location.href = `/download/${data}`;
        }
      });
  }

  downloadSVG = this.download.bind(this, 'svg')
  downloadPNG = this.download.bind(this, 'png')

  render() {
    const { iconDetail } = this.props;
    const tagArr = this.tagsToArr(iconDetail.tags || '');
    const options = [32, 64, 128, 256].map((size, i) => (
      <Option
        value={`${size}`}
        className="select-narrow-menu"
        key={i}
      >
        {size}
      </Option>
    ));

    return (
      <div className="tan-container">
        <IconBgGrid
          bgSize={257}
          iconPath={iconDetail.path}
          iconSize={iconDetail.iconStyle.size}
          iconColor={iconDetail.iconStyle.color}
        />
        <div className="tan-detail">
          <div className="tan-detail-header">
            <div className="icon-name">
              <span className="icon-name-txt">{iconDetail.name}</span>
            </div>
          </div>
          <div className="other-info">
            <span className="author">上传人：{iconDetail.user.name}</span>&nbsp;&nbsp;
          </div>
          <div className="tag-info">
            <span className="tag-detail">标签：</span>
            {
              tagArr.map((item, index) => (
                <span className="tag-detail" key={index}>{item}</span>
              ))
            }
          </div>
          <div className="select-color clearfix">
            <ul className="color-list">
              {
                ['#1dba9c', '#26cb72', '#5aace2', '#9c58b6', '#34475e',
                '#f3c52d', '#e88027', '#ff5555', '#ecf0f1', '#a9b7b7'].map((color, index) => (
                  <li
                    className="color-item"
                    style={{ background: color }}
                    onClick={() => this.changeIconColor(color)}
                    key={index}
                  ></li>
                ))
              }
            </ul>
            <div className="color-select-box">
              <Input
                defaultValue={iconDetail.iconStyle.color}
                regExp={COLOR.reg}
                onChange={this.changeIconColor}
                strict
                ref="colorInput"
              />
              <div className="color-show" style={{ background: iconDetail.iconStyle.color }}></div>
            </div>
            <Select
              defaultValue="256"
              value={String(iconDetail.iconStyle.size)}
              onChange={this.changeIconSize}
              className="set-size"
            >
              {options}
            </Select>
          </div>
          <div className="download-box">
            <button className="download-btn" onClick={this.downloadSVG}>SVG下载</button>
            <button className="download-btn disabled" disabled>AI下载</button>
            <button className="download-btn" onClick={this.downloadPNG}>PNG下载</button>
          </div>
        </div>
      </div>
    );
  }
}

DownloadDialog.propTypes = {
  iconDetail: PropTypes.object,
  editIconStyle: PropTypes.func,
};

export default DownloadDialog;
