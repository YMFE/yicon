import './Uploaded.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { SubTitle, Content, Timeline, InfoItem, DesIcon } from '../../components/';
import { fetchUploaded, deleteIcon } from '../../actions/uploaded';
import { iconStatus } from '../../constants/utils';
import confirm from '../../components/common/Dialog/Confirm.jsx';
import Pager from '../../components/common/Pager/';

const statusMap = {
  [iconStatus.UPLOADED]: {
    text: '未提交',
    className: 'checking',
  },
  [iconStatus.REJECTED]: {
    text: '审核失败',
    className: 'fault',
  },
  [iconStatus.PENDING]: {
    text: '待审核',
    className: 'checking',
  },
  [iconStatus.RESOLVED]: {
    text: '通过审核',
    className: 'passed',
  },
};

@connect(
  state => ({
    list: state.user.uploaded.list,
    totalPage: state.user.uploaded.totalPage,
    currentPage: state.user.uploaded.currentPage,
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
    currentPage: PropTypes.number,
  }

  componentDidMount() {
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
        this.props.deleteIcon(iconId, this.props.currentPage);
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
            ? <TimelineList
              {...this.props}
              onDeleteIcon={this.deleteIcon}
              onChangePage={this.props.fetchUploaded}
            />
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
    <div className="context">
      <Timeline>
      {list.map((item, index) => (
        <InfoItem
          extraClass="new"
          key={index}
          timeStr={item.createTime}
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
                    {
                      icon.status === iconStatus.UPLOADED || icon.status === iconStatus.REJECTED ?
                        <i
                          className="tool-item iconfont delete"
                          title="删除"
                          onClick={props.onDeleteIcon}
                        >&#xf513;</i>
                       :
                      null
                    }
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
      <div className="pager-container">
        <Pager
          defaultCurrent={props.currentPage}
          totalPage={Math.ceil(props.totalPage / 10)}
          onClick={props.onChangePage}
        />
      </div>
    </div>
  );
};

TimelineList.propTypes = {
  list: PropTypes.array,
  onDeleteIcon: PropTypes.func,
  currentPage: PropTypes.number,
  totalPage: PropTypes.number,
  onChangePage: PropTypes.func,
};

export default Uploaded;
