import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { fetchRepositoryLogs, fetchRepository } from '../../actions/repository';
import { SubTitle, Content } from '../../components/';
import TimelineList from './TimelineList.jsx';
import Pager from '../../components/common/Pager/';
import Loading from '../../components/common/Loading/Loading.jsx';
import {
  getInfoDetail,
} from '../../actions/notification';

@connect(
  state => ({
    ...state.log.repo,
    infoDetail: state.user.notification.infoDetail,
    currRepository: state.repository.currRepository,
  }),
  {
    fetchRepositoryLogs,
    getInfoDetail,
    fetchRepository,
  }
)
class Log extends Component {

  static propTypes = {
    params: PropTypes.object,
    list: PropTypes.array,
    currentPage: PropTypes.number,
    totalCount: PropTypes.number,
    fetchRepositoryLogs: PropTypes.func,
    infoDetail: PropTypes.object,
    getInfoDetail: PropTypes.func,
    currRepository: PropTypes.object,
    fetchRepository: PropTypes.func,
  }

  state = {
    isShowLoading: false,
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.fetchLogWrapper();
    this.props.fetchRepositoryLogs(id, 1);
  }

  @autobind
  onChangePage(page) {
    const { id } = this.props.params;
    this.props.fetchRepositoryLogs(id, page);
  }

  @autobind
  fetchLogWrapper(currentId) {
    let { params: { id } } = this.props;
    if (currentId) id = currentId;

    this.setState({
      isShowLoading: true,
    }, () => {
      this.props.fetchRepository(id)
        .then(() => this.setState({ isShowLoading: false }))
        .catch(() => this.setState({ isShowLoading: false }));
    });
  }

  render() {
    const { currRepository: { name }, list, currentPage, totalCount, infoDetail } = this.props;
    const mainClass = classnames({
      'empty-content': !list.length,
    });

    return (
      <div className="log">
        <SubTitle tit={`${name || ''}图标库日志`} />
        <Content>
          <div className={mainClass} style={{ width: '100%' }}>
            <TimelineList
              list={list}
              infoDetail={infoDetail}
              getInfoDetail={this.props.getInfoDetail}
            />
            <div className="pager-container">
              {list.length ?
                <Pager
                  defaultCurrent={currentPage}
                  pageSize={10}
                  totalPage={Math.ceil(totalCount / 10)}
                  totalCount={totalCount}
                  onClick={this.onChangePage}
                /> :
                null
              }
            </div>
          </div>
        </Content>
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}

export default Log;
