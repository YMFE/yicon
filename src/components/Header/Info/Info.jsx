import './Info.scss';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';

import { fetchUnreadNotification, setPollingId } from '../../../actions/notification';

@connect(
  state => ({
    userInfo: state.user.info,
    infoCount: state.user.notification.unReadCount,
    pollingId: state.user.notification.pollingId,
  }),
  { fetchUnreadNotification, setPollingId }
)
class Info extends Component {
  static propTypes = {
    userInfo: PropTypes.object,
    infoCount: PropTypes.number,
    pollingId: PropTypes.number,
    fetchUnreadNotification: PropTypes.func,
    setPollingId: PropTypes.func,
  }

  componentDidMount() {
    const { pathname } = location;
    if (this.props.userInfo.login && pathname !== '/user/notifications') {
      this.props.fetchUnreadNotification();
      this.pulseId = setInterval(() => {
        this.props.fetchUnreadNotification();
      }, 30 * 1000);
      this.props.setPollingId(this.pulseId);
    }
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  @autobind
  stopPolling() {
    const { pollingId } = this.props;
    if (pollingId) {
      clearInterval(pollingId);
      this.props.setPollingId();
    }
  }

  render() {
    const { infoCount } = this.props;
    const countNum = infoCount
      ? <i className="nav-message-count">{infoCount < 100 ? infoCount : '99+'}</i>
      : null;

    return (
      <li className="lists">
        <Link to="/user/notifications" className="nav-message" onClick={this.stopPolling}>
          <i className="iconfont">&#xf50d;</i>
          {countNum}
        </Link>
      </li>
    );
  }
}

export default Info;
