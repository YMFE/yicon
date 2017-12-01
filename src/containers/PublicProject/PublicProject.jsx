import './PublicProject.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import UserProject from '../UserProject/UserProject';
import History from '../History/History';
import Loading from '../../components/common/Loading/Loading.jsx';
import { getUsersProjectList } from '../../actions/project';

/* eslint-disable react/no-multi-comp */
class NoProject extends Component {
  static propTypes = {
    hideLoading: PropTypes.func,
  }

  componentDidMount() {
    this.props.hideLoading();
  }

  render() {
    return (
      <div className="empty-project"></div>
    );
  }
}

@connect((state) => ({
  user: state.user.info,
  usersProjectList: state.project.usersProjectList,
}), { getUsersProjectList })
export default class PublicProject extends Component {

  static propTypes = {
    params: PropTypes.object,
    getUsersProjectList: PropTypes.func,
    user: PropTypes.object,
    usersProjectList: PropTypes.array,
    location: PropTypes.object,
  };

  state = {
    isShowLoading: true,
    cacheProjectList: '',
  };

  componentWillMount() {
    this._isMounted = true;
    if (this.props.user.login) {
      this.replaceProject();
    }
  }

  componentDidMount() {
    this.pulseId = setInterval(() => {
      this.replaceProject();
    }, 30 * 1000);
  }

  componentWillReceiveProps(nextProps) {
    const id = this.props.params.id;
    const nextId = nextProps.params.id;
    const query = this.props.location.query || {};
    const nextQuery = nextProps.location.query || {};
    if ((id !== nextId || query.from !== nextQuery.from) && this.props.user.login) {
      this.replaceProject();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.pulseId) clearInterval(this.pulseId);
  }

  replaceProject() {
    this.setState({
      cacheProjectList: this.props.getUsersProjectList(),
    });
  }

  @autobind
  hideLoading() {
    if (this._isMounted) {
      this.setState({
        isShowLoading: false,
      });
    }
  }

  renderContent(id) {
    const { from } = this.props.location && this.props.location.query;
    const { cacheProjectList } = this.state;
    if (!id) {
      return <NoProject hideLoading={this.hideLoading} />;
    }
    let content;
    const isBelong = this.props.usersProjectList.some(v => v.id === +id);
    if (this.props.user.login && isBelong) {
      content = (<UserProject
        projectId={id}
        cacheProjectList={cacheProjectList}
        from={from}
        hideLoading={this.hideLoading}
      />);
    } else {
      content = <History projectId={id} isHidden hideLoading={this.hideLoading} />;
    }
    return content;
  }

  render() {
    let projectId = '';
    if (this.props.usersProjectList.length) {
      projectId = this.props.usersProjectList[0].id;
    }
    const id = this.props.params.id || projectId;
    const content = this.renderContent(String(id));
    return (
      <div>
        {content}
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}
