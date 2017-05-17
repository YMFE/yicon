import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { fetchProjectLogs } from '../../actions/project';
import { SubTitle, Content } from '../../components/';
import Pager from '../../components/common/Pager/';
import TimelineList from './TimelineList.jsx';
import {
  getInfoDetail,
} from '../../actions/notification';

@connect(
  state => ({
    ...state.log.project,
    infoDetail: state.user.notification.infoDetail,
  }),
  {
    fetchProjectLogs,
    getInfoDetail,
  }
)
class Log extends Component {

  static propTypes = {
    params: PropTypes.object,
    list: PropTypes.array,
    currentPage: PropTypes.number,
    totalCount: PropTypes.number,
    fetchProjectLogs: PropTypes.func,
    infoDetail: PropTypes.object,
    getInfoDetail: PropTypes.func,
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.props.fetchProjectLogs(id, 1);
  }

  @autobind
  onChangePage(page) {
    const { id } = this.props.params;
    this.props.fetchProjectLogs(id, page);
  }

  render() {
    const {
      list,
      currentPage,
      totalCount,
      infoDetail,
    } = this.props;
    const mainClass = classnames({
      'empty-content': !list.length,
    });

    return (
      <div className="log">
        <SubTitle tit="项目日志" />
        <Content>
          <div className={mainClass} style={{ width: '100%' }}>
            {list.length ?
              <div>
                <TimelineList
                  list={list}
                  infoDetail={infoDetail}
                  getInfoDetail={this.props.getInfoDetail}
                />
                <div className="pager-container">
                  <Pager
                    defaultCurrent={currentPage}
                    pageSize={10}
                    totalPage={Math.ceil(totalCount / 10)}
                    totalCount={totalCount}
                    onClick={this.onChangePage}
                  />
                </div>
              </div>
              : null
            }
          </div>
        </Content>
      </div>
    );
  }
}

export default Log;
