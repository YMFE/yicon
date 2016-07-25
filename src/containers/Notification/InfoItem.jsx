import React, { Component, PropTypes } from 'react';
// import { Icon } from '../../components/';


class InfoItem extends Component {
  static propTypes = {
    tag: PropTypes.string,
    tit: PropTypes.string,
    titleHtml: PropTypes.string,
    timeStr: PropTypes.string,
    isNew: PropTypes.bool,
    extraClass: PropTypes.string,
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
          <p className="time">{this.props.timeStr}</p>
          <p className="tag">{this.props.tag}</p>
        </dt>
        <dd className="content">
          {
            this.props.titleHtml ?
              <p className="title" dangerouslySetInnerHTML={{ __html: this.props.titleHtml }} /> :
              <p className="title">{this.props.tit}</p>
          }
        </dd>
      </dl>
    );
  }
}

export default InfoItem;
