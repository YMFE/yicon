import React, { Component, PropTypes } from 'react';
import timer from '../../helpers/timer';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
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
    hasScope: PropTypes.bool,
  }

  getTitle() {
    const { item, showTitleHtml, tit } = this.props;
    if (showTitleHtml) {
      return this.getDescribeForInfo(item);
    }
    if (tit) {
      return <p className="title">{tit}</p>;
    }
    return null;
  }

  @autobind
  getDescribeForInfo({ operation, scope, project, repo }) {
    const regExp = /@([^@]+)@/g;
    let prefix = null;
    let result = regExp.exec(operation);
    let content = [];
    let lastIndex = 0;
    let index = 0;

    while (result !== null) {
      let text;
      const matched = result[1];

      index = result.index;
      // 先处理下匹配之前的部分
      const prevText = operation.slice(lastIndex, index);
      if (prevText.length) content.push(<span key={lastIndex}>{prevText}</span>);
      lastIndex = regExp.lastIndex;

      // 处理下匹配到的关键词
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

      content.push(<span key={index} className="key">{text}</span>);
      result = regExp.exec(operation);
    }
    // 查看尾巴是否有未捕获的
    const tailText = operation.slice(lastIndex, operation.length);
    if (tailText.length) content.push(<span key={lastIndex}>{tailText}</span>);

    if (this.props.hasScope) {
      const scopeData = scope === 'project' ? project : repo;
      const link = scope === 'project'
        ? `/user/projects/${project.id}`
        : `/repositories/${repo.id}`;

      prefix = (
        <span><Link to={link}>{scopeData.name}</Link>：</span>
      );
    }
    return <p className="title">{prefix}{content}</p>;
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
