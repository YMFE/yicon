import React, { Component, PropTypes } from 'react';
import timer from '../../helpers/timer';
// import { Icon } from '../../components/';

class InfoItem extends Component {

  static propTypes = {
    tag: PropTypes.string,
    tit: PropTypes.string,
    showTitleHtml: PropTypes.bool,
    item: PropTypes.object,
    timeStr: PropTypes.string,
    isNew: PropTypes.bool,
    extraClass: PropTypes.string,
    timeString: PropTypes.string,
    children: PropTypes.element,
  }

  getTitle() {
    const { item, showTitleHtml, tit } = this.props;
    if (showTitleHtml) {
      return (
        <p
          className="title"
          dangerouslySetInnerHTML={{ __html: this.getDescribeForInfo(item) }}
        />
      );
    } else if (tit) {
      return <p className="title">{tit}</p>;
    }
    return null;
  }

  getDescribeForInfo({ operation }) {
    // TODO: 这 tmd 对前端来说太不友好了
    const regExp = /@([^@]+)@/g;
    return operation.replace(regExp, (_, matched) => {
      let text;
      const data = JSON.parse(matched);
      // 处理一下各种日志的情况
      const keys = Object.keys(data);
      // 我们一般只有一个 key
      const firstKey = keys[0];
      if (keys.indexOf('icon') || keys.indexOf('user')) {
        text = data[firstKey].name;
      } else {
        text = data[firstKey];
      }

      return `<span class="key">${text}</span>`;
    });
  }

  render() {
    let classList = [];
    if (this.isNew) classList.push('new');
    if (this.props.extraClass) classList.push(this.props.extraClass);
    classList = classList.join(' ');
    return (
      <dl
        className={classList}
      >
        <dt className="description">
          <p className="time">
          {
            this.props.timeString ?
            this.props.timeString :
            timer(this.props.timeStr)
          }
          </p>
          <p className="tag">{this.props.tag}</p>
        </dt>
        <dd className="content">
          {
            this.getTitle()
          }
          {this.props.children}
        </dd>
      </dl>
    );
  }
}

export default InfoItem;
