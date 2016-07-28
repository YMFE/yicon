import React, { Component, PropTypes } from 'react';
import timer from '../../helpers/timer';
// import { Icon } from '../../components/';

class InfoItem extends Component {
  static propTypes = {
    tag: PropTypes.string,
    tit: PropTypes.string,
    titleHtml: PropTypes.string,
    timeStr: PropTypes.string,
    isNew: PropTypes.bool,
    extraClass: PropTypes.string,
    timeString: PropTypes.string,
    children: PropTypes.element,
  }

  getTitle() {
    if (this.props.titleHtml) {
      return <p className="title" dangerouslySetInnerHTML={{ __html: this.props.titleHtml }} />;
    } else if (this.props.tit) {
      return <p className="title">{this.props.tit}</p>;
    }
    return null;
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
