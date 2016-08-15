import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { fetchRepositoryLogs } from '../../actions/repository';
import { SubTitle, Content } from '../../components/';
import TimelineList from './TimelineList.jsx';
import Pager from '../../components/common/Pager/';
import {
  getInfoDetail,
} from '../../actions/notification';


@connect(
  state => ({
    ...state.log.repo,
    infoDetail: state.user.notification.infoDetail,
  }),
  { fetchRepositoryLogs, getInfoDetail }
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
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.fetchRepositoryLogs(id, 1);
  }

  @autobind
  onChangePage(page) {
    const { id } = this.props.params;
    this.props.fetchRepositoryLogs(id, page);
  }

  render() {
    const { list, currentPage, totalCount, infoDetail } = this.props;
    const mainClass = classnames({
      'empty-content': !list.length,
    });

    return (
      <div className="log">
        <SubTitle tit="图标库日志" />
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
                  totalCount={totalCount}
                  onClick={this.onChangePage}
                /> :
                null
              }
            </div>
          </div>
        </Content>
      </div>
    );
  }
}

export default Log;
