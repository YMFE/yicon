import './ReviewProjectAdmin.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Review, SubTitle } from '../../components/';
import Message from '../../components/common/Message/Message';
import {
  getApplyAdminList,
  changeProjectNewAdmin,
} from '../../actions/notification';

@connect(
  () => ({}),
  {
    getApplyAdminList,
    changeProjectNewAdmin,
  }
)


class ReviewProjectAdmin extends Component {
  static propTypes = {
    getApplyAdminList: PropTypes.func,
    changeProjectNewAdmin: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      content: [],
    };
  }

  componentDidMount() {
    this.getApplyAdminList();
  }

  @autobind
  onClickHandle(data, action) {
    const d = {
      action,
      projectId: data.project.id,
      logId: data.id,
    };
    const mess = action === 'agree' ? '申请审批成功!' : '申请拒绝成功!';

    this.props.changeProjectNewAdmin(d)
      .then(result => {
        if (result.payload.res) {
          this.getApplyAdminList();
          this.openMessage(mess);
        }
      });
  }

  getApplyAdminList() {
    this.props.getApplyAdminList()
      .then(data => {
        this.setState({
          content: data.payload.data,
        });
      });
  }

  openMessage(message) {
    Message.success(message);
  }

  render() {
    const { content = [] } = this.state;
    const title = '管理员申请';
    const agreeContent = '同意该用户成为此项目的管理员吗';
    const cancelContent = '拒绝该用户成为此项目的管理员吗';

    return (
      <div className="review-project">
        <SubTitle tit="审核项目管理员" />
        <ul className="navs">
          <li className={'active'}>待审核</li>
        </ul>
        <Review
          title={title}
          agreeContent={agreeContent}
          cancelContent={cancelContent}
          content={content}
          showDescList={['项目名称', '管理员', '申请人', '申请时间']}
          showKeys={['project.name', 'project.projectOwner.name', 'logCreator.name', 'updatedAt']}
          showTabLayout={[20, 20, 20, 20]}
          section={'review'}
          agreeHandle={this.onClickHandle}
          cancelHandle={this.onClickHandle}
        />

      </div>
    );
  }
}

export default ReviewProjectAdmin;
