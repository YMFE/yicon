import './Uploaded.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Timeline, InfoItem, DesIcon } from '../../components/';
import { fetchUploaded, deleteIcon } from '../../actions/uploaded';
import confirm from '../../components/common/Dialog/Confirm.jsx';

const statusMap = {
  0: {
    text: '未提交',
    className: 'checking',
  },
  5: {
    text: '审核失败',
    className: 'fault',
  },
  10: {
    text: '待审核',
    className: 'checking',
  },
  20: {
    text: '通过审核',
    className: 'passed',
  },
};

const handleTime = (t) => {
  const time = new Date(t);
  const description = [];
  description.push(time.getFullYear());
  description.push(time.getMonth() + 1);
  description.push(time.getDate());
  return description.join('-');
};

@connect(
  state => ({
    list: state.uploaded.list,
  }),
  {
    fetchUploaded,
    deleteIcon,
  }
)

class Uploaded extends Component {
  static propTypes = {
    list: PropTypes.array,
    fetchUploaded: PropTypes.func,
    deleteIcon: PropTypes.func,
  }

  componentWillMount() {
    this.props.fetchUploaded(1);
  }

  @autobind
  deleteIcon(e) {
    const iconNode = e.currentTarget.parentElement;
    const iconId = iconNode.dataset.id;
    confirm({
      title: '删除确认',
      content: '是否确认删除图标',
      onOk: () => {
        this.props.deleteIcon(iconId);
      },
      onCancel: () => {},
    });
  }

  render() {
    const { list } = this.props;
    let mainClassList = (list instanceof Array && list.length === 0) ? 'empty-container' : '';
    return (
      <div className="uploaded">
        <SubTitle tit="我上传的图标" />
        <Content extraClass={mainClassList}>
          {
            list && list.length > 0
            ? <TimelineList {...this.props} onDeleteIcon={this.deleteIcon} />
            : null
          }
        </Content>
      </div>
    );
  }
}

const TimelineList = (props) => {
  const { list } = props;
  return (
    <Timeline>
    {list.map((item, index) => (
      <InfoItem
        extraClass="new"
        key={index}
        timeString={handleTime(item.applyTime)}
      >
        <div className="detail">
          {
            item.icons.map((icon, indx) => {
              const iconClasslist = ['state'];
              iconClasslist.push(statusMap[icon.status].className);
              return (
                <DesIcon
                  key={indx}
                  className="detail-icon"
                  name={icon.name}
                  showCode={false}
                  iconPath={icon.path}
                >
                  <p className={iconClasslist.join(' ')}>
                      {statusMap[icon.status].text}
                  </p>
                  <p className="tool" data-id={icon.id}>
                    <i
                      className="tool-item iconfont delete"
                      title="删除"
                      onClick={props.onDeleteIcon}
                    >&#xf513;</i>
                  </p>
                </DesIcon>
              );
            }
            )
          }
        </div>
      </InfoItem>
      ))
    }
    </Timeline>
  );
};

TimelineList.propTypes = {
  list: PropTypes.array,
  onDeleteIcon: PropTypes.func,
};

export default Uploaded;
