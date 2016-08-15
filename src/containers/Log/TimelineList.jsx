import React, { Component, PropTypes } from 'react';
import { Timeline, InfoItem } from '../../components/';
import { InfoTemplate } from '../../constants/utils.js';
import { autobind } from 'core-decorators';

export default class TimelineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoState: {},
    };
  }

  @autobind
  onShowDetail(e, item) {
    const id = item.id;
    const infoState = Object.assign({}, this.state.infoState);
    if (this.props.infoDetail && this.props.infoDetail[id]) {
      const isShow =
      infoState[id] && typeof infoState[id].isShow === 'boolean' ?
      !infoState[id].isShow :
      true;
      infoState[id] = {
        isShow,
      };
    } else {
      this.props.getInfoDetail(id);
      infoState[id] = {
        isShow: true,
      };
    }
    this.setState({
      infoState,
    });
  }
  renderTimeItemDetail(item) {
    const { infoDetail } = this.props;
    if (infoDetail && infoDetail[item.id]) {
      return (
        <div className="detail">
        {InfoTemplate[item.type](infoDetail[item.id])}
        </div>
      );
    }
    return null;
  }
  render() {
    const {
      list,
      infoDetail,
     } = this.props;
    const {
      infoState,
    } = this.state;
    return (
      <Timeline>
      {list.map(item => (
        <InfoItem
          key={item.id}
          extraClass={"log"}
          tag={item.logCreator.name}
          timeStr={item.createdAt}
          showTitleHtml
          item={item}
          showDetail={
            infoDetail
            && infoDetail[item.id]
            && infoState[item.id]
            && infoState[item.id].isShow
          }
          onShowDetail={(e) => { this.onShowDetail(e, item); }}
        >
        {
          infoState[item.id] && infoState[item.id].isShow
          ? this.renderTimeItemDetail(item)
          : null
        }
        </InfoItem>
      ))}
      </Timeline>
    );
  }
}

TimelineList.propTypes = {
  list: PropTypes.array,
  infoState: PropTypes.object,
  infoDetail: PropTypes.object,
  getInfoDetail: PropTypes.func,
};
