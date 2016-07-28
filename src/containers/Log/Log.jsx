import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { fetchRepositoryLogs } from '../../actions/repository';
import { SubTitle, Content, Timeline, InfoItem } from '../../components/';
import Pager from '../../components/common/Pager/';

@connect(
  state => ({ ...state.log.repo }),
  { fetchRepositoryLogs }
)
class Log extends Component {

  static propTypes = {
    params: PropTypes.object,
    list: PropTypes.array,
    currentPage: PropTypes.number,
    totalCount: PropTypes.number,
    fetchRepositoryLogs: PropTypes.func,
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
    const { list, currentPage, totalCount } = this.props;
    const mainClass = classnames({
      'empty-container': !list.length,
    });

    return (
      <div className="log">
        <SubTitle tit="图标日志" />
        <Content extraClass={mainClass}>
          <div style={{ width: '100%' }}>
            <TimelineList list={list} />
            <div className="pager-container">
              {list.length &&
                <Pager
                  defaultCurrent={currentPage}
                  totalCount={totalCount}
                  onClick={this.onChangePage}
                />
              }
            </div>
          </div>
        </Content>
      </div>
    );
  }
}

const TimelineList = props => (
  <Timeline>
    {props.list.map(item => (
      <InfoItem
        key={item.id}
        tag={item.logCreator.name}
        timeStr={item.createdAt}
        showTitleHtml
        item={item}
      />
    ))}
  </Timeline>
);

TimelineList.propTypes = {
  list: PropTypes.array,
};

export default Log;
