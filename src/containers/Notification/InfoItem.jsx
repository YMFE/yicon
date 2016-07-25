import React, { Component, PropTypes } from 'react';
import { Icon } from '../../components/';

class InfoItem extends Component {
  static propTypes = {
    key: PropTypes.oneOf([
      PropTypes.number,
      PropTypes.string,
    ]),
    timeStr: PropTypes.string,
  }
  render() {
    return (
      <dl key={this.props.key}>
        <dt className="description">
          <p className="time">{this.props.timeStr}</p>
          <p className="tag">系统</p>
        </dt>
        <dd className="content">
          <p className="title">您上传到<span className="key">QTA图标库</span>的图标已经审核完成</p>
          <div className="detail">
            <Icon className="detail-item" code={"&#xf50f;"} name="上传" showCode={false}>
              <p className="state passed">{"审核完成"}</p>
            </Icon>
            <Icon className="detail-item" name="上传" showCode={false}>
              <p className="state passed">{"审核完成"}</p>
            </Icon>
            <Icon className="detail-item" name="上传" showCode={false}>
              <p className="state checking">{"待审核"}</p>
            </Icon>
            <Icon className="detail-item" name="上传" showCode={false}>
              <p className="state fault">{"审核失败"}</p>
            </Icon>
            <Icon className="detail-item" name="上传" showCode={false}>
              <p className="state fault">{"审核失败"}</p>
            </Icon>
            <Icon className="detail-item" name="上传" showCode={false}>
              <p className="state fault">{"审核失败"}</p>
            </Icon>
          </div>
        </dd>
      </dl>
    );
  }
}

export default InfoItem;
