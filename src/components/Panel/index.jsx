import React, { Component, PropTypes } from 'react';
import './Panel.scss';

export default class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myDisplay: 'none',
    };
  }

  changeOwner(evt, id) {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.onClick(id);
  }

  render() {
    return (
      <dl
        className={this.props.extraClass ?
          `authority-list-item ${this.props.extraClass}` : 'authority-list-item'}
      >
        <dt className="prj-name">
          <span>{this.props.panelName}</span>
        </dt>
        <dd className="tool">
          <span className="admin-name">{this.props.ownerName}</span>
          <a
            href="#"
            className="change-admin"
            onClick={(evt) => this.changeOwner(evt, this.props.id)}
          >更换管理员</a>
          <span
            className="tips"
            style={{ display: this.state.myDisplay }}
          ><i className="iconfont">&#xf078;</i>更换成功！</span>
        </dd>
      </dl>
    );
  }
}

Panel.propTypes = {
  extraClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  panelName: PropTypes.string.isRequired,
  ownerName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};
